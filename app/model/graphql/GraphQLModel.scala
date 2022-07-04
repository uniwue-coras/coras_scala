package model.graphql

import com.github.t3hnar.bcrypt._
import model._
import play.api.libs.json._
import sangria.execution.UserFacingError
import sangria.schema._

import scala.collection.mutable.{Map => MutableMap}
import scala.concurrent.{ExecutionContext, Future}

final case class GraphQLRequest(
  query: String,
  operationName: Option[String],
  variables: Option[JsValue]
)

final case class GraphQLContext(
  mongoQueries: MongoQueries,
  user: Option[User]
)

final case class UserFacingGraphQLError(msg: String) extends Exception(msg) with UserFacingError

trait GraphQLModel extends GraphQLArguments with JwtHelpers with GraphQLBasics {

  protected implicit val ec: ExecutionContext

  protected val jwtsToClaim: MutableMap[String, LoginResult] = MutableMap.empty

  private val queryType = ObjectType(
    "Query",
    fields[GraphQLContext, Unit](
      Field(
        "exercises",
        ListType(ExerciseGraphQLModel.queryType),
        resolve = implicit context => withUser { _ => context.ctx.mongoQueries.futureAllExercises }
      ),
      Field(
        "exercise",
        ExerciseGraphQLModel.queryType,
        arguments = exerciseIdArg :: Nil,
        resolve = implicit context =>
          withUser { _ =>
            for {
              maybeExercise: Option[Exercise] <- context.ctx.mongoQueries.futureExerciseById(context.arg(exerciseIdArg))

              result <- maybeExercise match {
                case None           => Future.failed(UserFacingGraphQLError("No such exercise!"))
                case Some(exercise) => Future.successful(exercise)
              }
            } yield result
          }
      )
    )
  )

  // Mutations

  private def resolveRegistration(context: Context[GraphQLContext, Unit]): Future[String] = context.arg(registerInputArg) match {
    case RegisterInput(username, password, passwordRepeat) if password == passwordRepeat =>
      context.ctx.mongoQueries
        .futureInsertUser(User(username, Some(password.boundedBcrypt), Rights.Student))
        .map(_ => username)

    case _ => Future.failed(UserFacingGraphQLError("Passwords do not match!"))
  }

  private def resolveLogin(context: Context[GraphQLContext, Unit]): Future[LoginResult] = context.arg(loginInputArg) match {
    case LoginInput(username, password) =>
      val onError = Future.failed(UserFacingGraphQLError("Invalid combination of username and password!"))

      for {
        maybeUser <- context.ctx.mongoQueries.futureMaybeUserByUsername(username)

        result <- maybeUser match {
          case Some(User(username, Some(pwHash), rights)) if password.isBcryptedBounded(pwHash) =>
            Future.successful(LoginResult(username, rights, generateJwt(username)))
          case _ => onError
        }
      } yield result
  }

  private def resolveClaimJwt(context: Context[GraphQLContext, Unit]): Option[LoginResult] = jwtsToClaim.remove(context.arg(ltiUuidArgument))

  private def resolveChangePassword(context: Context[GraphQLContext, Unit]): Future[Boolean] = withUser { case User(username, maybeOldPasswordHash, _) =>
    context.arg(changePasswordInputArg) match {
      case ChangePasswordInput(oldPassword, newPassword, newPasswordRepeat) if newPassword == newPasswordRepeat =>
        maybeOldPasswordHash match {
          case Some(oldPasswordHash) if oldPassword.isBcryptedBounded(oldPasswordHash) =>
            context.ctx.mongoQueries.futureUpdatePassword(username, newPassword.boundedBcrypt)
          case _ => Future.failed(UserFacingGraphQLError("Can't change password!"))
        }
      case _ => Future.failed(UserFacingGraphQLError("Passwords do not match!"))
    }
  }(context)

  private def resolveCreateExercise(context: Context[GraphQLContext, Unit]): Future[Int] = withAdminUser { _ =>
    context.arg(exerciseInputArg) match {
      case GraphQLExerciseInput(title, text, sampleSolutionAsJson) =>
        for {
          sampleSolution <- readSolutionFromJsonString(sampleSolutionAsJson)

          maybeMaxExerciseId <- context.ctx.mongoQueries.futureMaxExerciseId

          exerciseId = maybeMaxExerciseId.map(_ + 1).getOrElse(0)

          _ <- context.ctx.mongoQueries.futureInsertExercise(Exercise(exerciseId, title, text, sampleSolution))
        } yield exerciseId
    }
  }(context)

  private def resolveExerciseMutations(context: Context[GraphQLContext, Unit]): Future[Option[Exercise]] =
    context.ctx.mongoQueries.futureExerciseById(context.arg(exerciseIdArg))

  private val mutationType = ObjectType(
    "Mutation",
    fields[GraphQLContext, Unit](
      Field("register", StringType, arguments = registerInputArg :: Nil, resolve = resolveRegistration),
      Field("login", LoginResult.queryType, arguments = loginInputArg :: Nil, resolve = resolveLogin),
      Field("claimJwt", OptionType(LoginResult.queryType), arguments = ltiUuidArgument :: Nil, resolve = resolveClaimJwt),
      Field("changePassword", BooleanType, arguments = changePasswordInputArg :: Nil, resolve = resolveChangePassword),
      Field("createExercise", IntType, arguments = exerciseInputArg :: Nil, resolve = resolveCreateExercise),
      Field("exerciseMutations", OptionType(ExerciseGraphQLModel.mutationType), arguments = exerciseIdArg :: Nil, resolve = resolveExerciseMutations)
    )
  )

  protected val schema: Schema[GraphQLContext, Unit] = Schema(queryType, Some(mutationType))

}
