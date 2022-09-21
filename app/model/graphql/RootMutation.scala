package model.graphql

import com.github.t3hnar.bcrypt._
import model._
import play.api.Logger
import sangria.schema._

import scala.collection.mutable.{Map => MutableMap}
import scala.concurrent.Future

trait RootMutation extends ExerciseMutations with GraphQLArguments with GraphQLBasics with JwtHelpers {

  private val logger = Logger(classOf[RootMutation])

  protected val jwtsToClaim: MutableMap[String, String] = MutableMap.empty

  private def futureFromOption[T](value: Option[T], onError: Throwable): Future[T] = value match {
    case Some(t) => Future.successful(t)
    case None    => Future.failed(onError)
  }

  private def futureFromBool(value: Boolean, onFalse: Throwable): Future[Unit] = if (value) {
    Future.successful(())
  } else {
    Future.failed(onFalse)
  }

  private val onLoginError    = UserFacingGraphQLError("Invalid combination of username and password!")
  private val onPwChangeError = UserFacingGraphQLError("Can't change password!")

  private val resolveLogin: Resolver[Unit, String] = context => {
    val LoginInput(username, password) = context.arg(loginInputArg)

    for {
      maybeUser         <- context.ctx.tableDefs.futureMaybeUserByUsername(username)
      user              <- futureFromOption(maybeUser, onLoginError)
      passwordHash      <- futureFromOption(user.maybePasswordHash, onLoginError)
      pwOkay            <- Future.fromTry { password isBcryptedSafeBounded passwordHash }
      _ /* pwChecked */ <- futureFromBool(pwOkay, onLoginError)
    } yield createJwtSession(user.username, user.rights).serialize
  }

  private def checkPwsMatch(firstPw: String, secondPw: String): Future[Unit] = if (firstPw == secondPw) {
    Future.successful(())
  } else {
    Future.failed(UserFacingGraphQLError("Passwords don't match!"))
  }

  private val resolveRegistration: Resolver[Unit, String] = context => {
    val RegisterInput(username, password, passwordRepeat) = context.arg(registerInputArg)

    for {
      _                <- checkPwsMatch(password, passwordRepeat)
      insertedUsername <- context.ctx.tableDefs.futureInsertUser(User(username, Some(password.boundedBcrypt), Rights.Student))
    } yield insertedUsername
  }

  private val resolveChangePassword: Resolver[Unit, Boolean] = resolveWithUser { case (context, User(username, maybeOldPasswordHash, _)) =>
    val ChangePasswordInput(oldPassword, newPassword, newPasswordRepeat) = context.arg(changePasswordInputArg)

    for {
      _ /* passwordsMatch */ <- checkPwsMatch(newPassword, newPasswordRepeat)
      oldPasswordHash        <- futureFromOption(maybeOldPasswordHash, onPwChangeError)
      oldPwOkay              <- Future.fromTry { oldPassword isBcryptedSafeBounded oldPasswordHash }
      _ /* pwChecked */      <- futureFromBool(oldPwOkay, onPwChangeError)
      passwordUpdated        <- context.ctx.tableDefs.futureUpdatePasswordForUser(username, Some(newPassword.boundedBcrypt))
    } yield passwordUpdated
  }

  private val resolveCreateExercise: Resolver[Unit, Int] = resolveWithAdmin { (context, _) =>
    val GraphQLExerciseInput(title, text, sampleSolutionAsJson) = context.arg(exerciseInputArg)

    for {
      sampleSolution <- readSolutionFromJsonString(sampleSolutionAsJson)

      flatSampleSolution = SolutionTree.flattenTree(sampleSolution)

      exerciseId <- context.ctx.tableDefs.futureInsertExercise(title, text)

      _ /* sampleSolutionInserted */ <- context.ctx.tableDefs.futureInsertSampleSolutionForExercise(exerciseId, flatSampleSolution)
    } yield exerciseId
  }

  private val resolveExerciseMutations: Resolver[Unit, Option[Exercise]] = context => context.ctx.tableDefs.futureMaybeExerciseById(context.arg(exerciseIdArg))

  private def resolveClaimJwt: Resolver[Unit, Option[String]] = context => jwtsToClaim.remove(context.arg(ltiUuidArgument))

  protected val mutationType: ObjectType[GraphQLContext, Unit] = ObjectType(
    "Mutation",
    fields[GraphQLContext, Unit](
      Field("register", StringType, arguments = registerInputArg :: Nil, resolve = resolveRegistration),
      Field("login", StringType, arguments = loginInputArg :: Nil, resolve = resolveLogin),
      Field("claimJwt", OptionType(StringType), arguments = ltiUuidArgument :: Nil, resolve = resolveClaimJwt),
      Field("changePassword", BooleanType, arguments = changePasswordInputArg :: Nil, resolve = resolveChangePassword),
      Field("createExercise", IntType, arguments = exerciseInputArg :: Nil, resolve = resolveCreateExercise),
      Field("exerciseMutations", OptionType(exerciseMutationType), arguments = exerciseIdArg :: Nil, resolve = resolveExerciseMutations)
    )
  )

}
