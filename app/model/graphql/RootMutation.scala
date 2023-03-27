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
      passwordHash     <- Future.fromTry { password.bcryptSafeBounded }
      _                <- futureFromBool(password == passwordRepeat, UserFacingGraphQLError("Passwords don't match"))
      insertedUsername <- context.ctx.tableDefs.futureInsertUser(User(username, Some(passwordHash), Rights.Student))
    } yield insertedUsername
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
      Field("register", StringType, arguments = usernameArg :: passwordArg :: passwordRepeatArg :: Nil, resolve = resolveRegistration),
      Field("login", StringType, arguments = usernameArg :: passwordArg :: Nil, resolve = resolveLogin),
      Field("claimJwt", OptionType(StringType), arguments = ltiUuidArgument :: Nil, resolve = resolveClaimJwt),
      Field("changePassword", BooleanType, arguments = oldPasswordArg :: passwordArg :: passwordRepeatArg :: Nil, resolve = resolveChangePassword),
      Field("createExercise", IntType, arguments = exerciseInputArg :: Nil, resolve = resolveCreateExercise),
      Field("exerciseMutations", ExerciseGraphQLTypes.exerciseMutationType, arguments = exerciseIdArg :: Nil, resolve = resolveExerciseMutations)
    )
  )

}
