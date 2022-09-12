package model.graphql

import com.github.t3hnar.bcrypt._
import model._
import pdi.jwt.{JwtClaim, JwtJson}
import sangria.schema._

import scala.collection.mutable.{Map => MutableMap}
import scala.concurrent.Future

trait RootMutation extends ExerciseMutations with GraphQLArguments with GraphQLBasics {

  protected val jwtsToClaim: MutableMap[String, LoginResult] = MutableMap.empty

  // Mutations

  protected def generateJwt(username: String): String = JwtJson.encode(
    JwtClaim(subject = Some(username))
  )

  private val resolveRegistration: Resolver[Unit, String] = context =>
    context.arg(registerInputArg) match {
      case RegisterInput(username, password, passwordRepeat) if password == passwordRepeat =>
        context.ctx.tableDefs
          .futureInsertUser(User(username, Some(password.boundedBcrypt), Rights.Student))
          .map(_ => username)
          .recoverWith(_ => Future.failed(UserFacingGraphQLError("Could not insert user!")))

      case _ => Future.failed(UserFacingGraphQLError("Passwords do not match!"))
    }

  private val resolveLogin: Resolver[Unit, LoginResult] = context => {
    val LoginInput(username, password) = context.arg(loginInputArg)

    for {
      maybeUser <- context.ctx.tableDefs.futureMaybeUserByUsername(username)

      result <- maybeUser match {
        case Some(User(username, Some(pwHash), rights)) if password.isBcryptedBounded(pwHash) =>
          Future.successful(LoginResult(username, rights, generateJwt(username)))
        case _ => Future.failed(UserFacingGraphQLError("Invalid combination of username and password!"))
      }
    } yield result
  }

  private val resolveClaimJwt: Resolver[Unit, Option[LoginResult]] = context => jwtsToClaim.remove(context.arg(ltiUuidArgument))

  private val resolveChangePassword: Resolver[Unit, Boolean] = implicit context =>
    withUser { case User(username, maybeOldPasswordHash, _) =>
      context.arg(changePasswordInputArg) match {
        case ChangePasswordInput(oldPassword, newPassword, newPasswordRepeat) if newPassword == newPasswordRepeat =>
          maybeOldPasswordHash match {
            case Some(oldPasswordHash) if oldPassword.isBcryptedBounded(oldPasswordHash) =>
              context.ctx.tableDefs.futureUpdatePasswordForUser(username, Some(newPassword.boundedBcrypt))
            case _ => Future.failed(UserFacingGraphQLError("Can't change password!"))
          }
        case _ => Future.failed(UserFacingGraphQLError("Passwords do not match!"))
      }
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
      Field("login", LoginResult.queryType, arguments = loginInputArg :: Nil, resolve = resolveLogin),
      Field("claimJwt", OptionType(LoginResult.queryType), arguments = ltiUuidArgument :: Nil, resolve = resolveClaimJwt),
      Field("changePassword", BooleanType, arguments = changePasswordInputArg :: Nil, resolve = resolveChangePassword),
      Field("createExercise", IntType, arguments = exerciseInputArg :: Nil, resolve = resolveCreateExercise),
      Field("exerciseMutations", OptionType(exerciseMutationType), arguments = exerciseIdArg :: Nil, resolve = resolveExerciseMutations)
    )
  )

}
