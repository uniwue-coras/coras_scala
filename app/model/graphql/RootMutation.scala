package model.graphql

import com.github.t3hnar.bcrypt._
import model._
import sangria.schema._

import scala.collection.mutable.{Map => MutableMap}
import scala.concurrent.Future

trait RootMutation extends ExerciseMutations with GraphQLArguments with GraphQLBasics with JwtHelpers {

  protected val jwtsToClaim: MutableMap[String, String] = MutableMap.empty

  private def futureFromOption[T](value: Option[T], onError: Throwable): Future[T] = value match {
    case Some(t) => Future.successful(t)
    case None    => Future.failed(onError)
  }

  private val onLoginError = UserFacingGraphQLError("Invalid combination of username and password!")

  private val resolveLogin: Resolver[Unit, String] = context => {
    val LoginInput(username, password) = context.arg(loginInputArg)

    for {
      maybeUser <- context.ctx.tableDefs.futureMaybeUserByUsername(username)

      user <- futureFromOption(maybeUser, onLoginError)

      passwordHash <- futureFromOption(user.maybePasswordHash, onLoginError)

      pwOkay <- Future.fromTry { password isBcryptedSafeBounded passwordHash }

      result <-
        if (pwOkay) {
          Future.successful(createJwtSession(user.username, user.rights).serialize)
        } else {
          Future.failed(onLoginError)
        }

    } yield result
  }

  private def resolveClaimJwt: Resolver[Unit, Option[String]] = context => jwtsToClaim.remove(context.arg(ltiUuidArgument))

  private def checkPwsMatch(firstPw: String, secondPw: String): Future[Unit] = if (firstPw == secondPw) {
    Future.successful(())
  } else {
    Future.failed(UserFacingGraphQLError("Passwords don't match!"))
  }

  private val resolveRegistration: Resolver[Unit, String] = context => {
    val RegisterInput(username, password, passwordRepeat) = context.arg(registerInputArg)

    for {
      _ <- checkPwsMatch(password, passwordRepeat)

      inserted <- context.ctx.tableDefs
        .futureInsertUser(User(username, Some(password.boundedBcrypt), Rights.Student))
        .map { _ => username }
        .recoverWith(_ => Future.failed(UserFacingGraphQLError("Could not insert user!")))
    } yield inserted
  }

  private val resolveChangePassword: Resolver[Unit, Boolean] = implicit context =>
    withUser { case User(username, maybeOldPasswordHash, _) =>
      val ChangePasswordInput(oldPassword, newPassword, newPasswordRepeat) = context.arg(changePasswordInputArg)

      for {
        _ <- checkPwsMatch(newPassword, newPasswordRepeat)

        oldPasswordHash <- maybeOldPasswordHash match {
          case Some(oldPwHash) => Future.successful(oldPwHash)
          case None            => Future.failed(UserFacingGraphQLError("Can't change password!"))
        }

        passwordsMatch = oldPassword.isBcryptedBounded(oldPasswordHash)

        x <-
          if (passwordsMatch) {
            context.ctx.tableDefs.futureUpdatePasswordForUser(username, Some(newPassword.boundedBcrypt))
          } else {
            Future.failed(UserFacingGraphQLError("Can't change password!"))
          }
      } yield x
    }

  private val resolveCreateExercise: Resolver[Unit, Int] = implicit context =>
    withAdminUser { _ =>
      val GraphQLExerciseInput(title, text, sampleSolutionAsJson) = context.arg(exerciseInputArg)

      for {
        sampleSolution <- readSolutionFromJsonString(sampleSolutionAsJson)

        exerciseId <- context.ctx.tableDefs.futureInsertExercise(title, text, sampleSolution)
      } yield exerciseId
    }

  private val resolveExerciseMutations: Resolver[Unit, Option[Exercise]] = context => context.ctx.tableDefs.futureMaybeExerciseById(context.arg(exerciseIdArg))

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
