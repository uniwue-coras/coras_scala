package model.graphql

import com.github.t3hnar.bcrypt._
import model._
import model.graphql.GraphQLArguments._
import sangria.schema._

import scala.collection.mutable.{Map => MutableMap}
import scala.concurrent.{ExecutionContext, Future}

trait RootMutation extends GraphQLBasics with JwtHelpers {

  protected implicit val ec: ExecutionContext

  protected val jwtsToClaim: MutableMap[String, String] = MutableMap.empty

  private val onLoginError    = UserFacingGraphQLError("Invalid combination of username and password!")
  private val onPwChangeError = UserFacingGraphQLError("Can't change password!")

  private val resolveLogin: Resolver[Unit, String] = context => {
    val username = context.arg(usernameArg)
    val password = context.arg(passwordArg)

    for {
      maybeUser         <- context.ctx.tableDefs.futureMaybeUserByUsername(username)
      user              <- futureFromOption(maybeUser, onLoginError)
      passwordHash      <- futureFromOption(user.maybePasswordHash, onLoginError)
      pwOkay            <- Future.fromTry { password isBcryptedSafeBounded passwordHash }
      _ /* pwChecked */ <- futureFromBool(pwOkay, onLoginError)
    } yield createJwtSession(user.username, user.rights).serialize
  }

  private val resolveRegistration: Resolver[Unit, String] = context => {
    val username       = context.arg(usernameArg)
    val password       = context.arg(passwordArg)
    val passwordRepeat = context.arg(passwordRepeatArg)

    for {
      passwordHash <- Future.fromTry { password.bcryptSafeBounded }
      _            <- futureFromBool(password == passwordRepeat, UserFacingGraphQLError("Passwords don't match"))
      _            <- context.ctx.tableDefs.futureInsertUser(User(username, Some(passwordHash), Rights.Student))
    } yield username
  }

  private val resolveChangePassword: Resolver[Unit, Boolean] = resolveWithUser { case (context, User(username, maybeOldPasswordHash, _)) =>
    val oldPassword       = context.arg(oldPasswordArg)
    val newPassword       = context.arg(passwordArg)
    val newPasswordRepeat = context.arg(passwordRepeatArg)

    for {
      _ /* passwordsMatch */ <- futureFromBool(newPassword == newPasswordRepeat, UserFacingGraphQLError("Passwords don't match"))
      oldPasswordHash        <- futureFromOption(maybeOldPasswordHash, onPwChangeError)
      oldPwOkay              <- Future.fromTry { oldPassword isBcryptedSafeBounded oldPasswordHash }
      _ /* pwChecked */      <- futureFromBool(oldPwOkay, onPwChangeError)
      passwordUpdated        <- context.ctx.tableDefs.futureUpdatePasswordForUser(username, Some(newPassword.boundedBcrypt))
    } yield passwordUpdated
  }

  private val resolveChangeRights: Resolver[Unit, Rights] = resolveWithAdmin { case (context, _) =>
    val username  = context.arg(usernameArg)
    val newRights = context.arg(newRightsArg)

    for {
      _ <- context.ctx.tableDefs.futureUpdateUserRights(username, newRights)
    } yield newRights
  }

  private val resolveRelatedWordsGroup: Resolver[Unit, Option[RelatedWordsGroup]] = resolveWithAdmin { case (context, _) =>
    context.ctx.tableDefs.futureRelatedWordGroupByGroupId(context.arg(groupIdArgument))
  }

  private val resolveCreateEmptyRelatedWordsGroup: Resolver[Unit, Int] = resolveWithAdmin { case (context, _) =>
    context.ctx.tableDefs.futureNewEmptyRelatedWordsGroup
  }

  @deprecated
  private val resolveUpdateSynonymAntonym: Resolver[Unit, Boolean] = resolveWithAdmin { case (context, _) =>
    // FIXME: implement!
    ???
  }

  private val resolveCreateExercise: Resolver[Unit, Int] = resolveWithAdmin { (context, _) =>
    val ExerciseInput(title, text, sampleSolution) = context.arg(exerciseInputArg)

    context.ctx.tableDefs.futureInsertExercise(title, text, sampleSolution)
  }

  private val resolveExerciseMutations: Resolver[Unit, Exercise] = context => {
    val exerciseId = context.arg(exerciseIdArg)

    for {
      maybeExercise <- context.ctx.tableDefs.futureMaybeExerciseById(exerciseId)
      exercise      <- futureFromOption(maybeExercise, UserFacingGraphQLError(s"No exercise with id $exerciseId"))
    } yield exercise
  }

  private def resolveClaimJwt: Resolver[Unit, Option[String]] = context => jwtsToClaim.remove(context.arg(ltiUuidArgument))

  val mutationType: ObjectType[GraphQLContext, Unit] = ObjectType(
    "Mutation",
    fields[GraphQLContext, Unit](
      // User management
      Field("register", StringType, arguments = usernameArg :: passwordArg :: passwordRepeatArg :: Nil, resolve = resolveRegistration),
      Field("login", StringType, arguments = usernameArg :: passwordArg :: Nil, resolve = resolveLogin),
      Field("claimJwt", OptionType(StringType), arguments = ltiUuidArgument :: Nil, resolve = resolveClaimJwt),
      Field("changePassword", BooleanType, arguments = oldPasswordArg :: passwordArg :: passwordRepeatArg :: Nil, resolve = resolveChangePassword),
      Field("changeRights", Rights.graphQLType, arguments = usernameArg :: newRightsArg :: Nil, resolve = resolveChangeRights),
      // synonyms + abbreviations
      Field("createEmptyRelatedWordsGroup", IntType, resolve = resolveCreateEmptyRelatedWordsGroup),
      Field(
        "relatedWordsGroup",
        OptionType(RelatedWordsGroupGraphQLTypes.mutationType),
        arguments = groupIdArgument :: Nil,
        resolve = resolveRelatedWordsGroup
      ),
      Field(
        "updateSynonymAntonym",
        BooleanType,
        deprecationReason = Some("TODO!"),
        arguments = groupIdArgument :: wordArgument :: Nil,
        resolve = resolveUpdateSynonymAntonym
      ),
      // correction
      Field("createExercise", IntType, arguments = exerciseInputArg :: Nil, resolve = resolveCreateExercise),
      Field("exerciseMutations", ExerciseGraphQLTypes.exerciseMutationType, arguments = exerciseIdArg :: Nil, resolve = resolveExerciseMutations)
    )
  )

}
