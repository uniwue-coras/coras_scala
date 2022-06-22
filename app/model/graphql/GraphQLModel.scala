package model.graphql

import com.github.t3hnar.bcrypt._
import model._
import play.api.libs.json._
import sangria.execution.UserFacingError
import sangria.schema._

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}

final case class GraphQLRequest(
  query: String,
  operationName: Option[String],
  variables: Option[JsValue]
)

final case class GraphQLContext(
  mongoQueries: MongoQueries,
  user: Option[User]
) {

  def resolveAdmin: Try[Unit] = user match {
    case Some(User(_, _, Rights.Admin)) => Success(())
    case _                              => Failure(UserFacingGraphQLError("User is not logged in or has insufficient rights!"))
  }

}

final case class UserFacingGraphQLError(msg: String) extends Exception(msg) with UserFacingError

trait GraphQLBasics {

  protected def withUser[T, V](f: User => Future[T])(implicit context: Context[GraphQLContext, V]): Future[T] = context.ctx.user match {
    case None       => Future.failed(UserFacingGraphQLError("User is not logged in!"))
    case Some(user) => f(user)
  }

  protected def withCorrectorUser[T, V](f: User => Future[T])(implicit context: Context[GraphQLContext, V]): Future[T] = withUser {
    case user if user.rights != Rights.Student => f(user)
    case _                                     => Future.failed(UserFacingGraphQLError("User has insufficient rights!"))
  }

  protected def withAdminUser[T, V](f: User => Future[T])(implicit context: Context[GraphQLContext, V]): Future[T] = withUser {
    case user if user.rights == Rights.Admin => f(user)
    case _                                   => Future.failed(UserFacingGraphQLError("User has insufficient rights!"))
  }

  protected def readSolutionFromJsonString(solutionString: String)(implicit ec: ExecutionContext): Future[Seq[SolutionNode]] = for {
    jsValue <- Future(Json.parse(solutionString))

    solution <- Json.fromJson[Seq[SolutionNode]](jsValue)(Reads.seq(SolutionNode.solutionNodeJsonFormat)) match {
      case JsSuccess(value, _) => Future.successful(value)
      case JsError(_)          => Future.failed(UserFacingGraphQLError("Sample solution was not valid JSON!"))
    }
  } yield solution

  protected def readCorrectionFromJsonString(jsonString: String)(implicit ec: ExecutionContext): Future[SolutionNodeMatchingResult] = for {
    jsValue <- Future(Json.parse(jsonString))

    correction <- Json.fromJson(jsValue)(Correction.correctionJsonFormat) match {
      case JsSuccess(value, _) => Future.successful(value)
      case JsError(_)          => Future.failed(UserFacingGraphQLError("Correction was not valid JSON!"))
    }
  } yield correction

}

class GraphQLModel @Inject() (implicit ec: ExecutionContext) extends GraphQLArguments with JwtHelpers with GraphQLBasics {

  private val queryType = ObjectType(
    "Query",
    fields[GraphQLContext, Unit](
      Field(
        "exercises",
        ListType(ExerciseGraphQLModel.queryType),
        resolve = _.ctx.mongoQueries.futureAllExercises
      ),
      Field(
        "exercise",
        OptionType(ExerciseGraphQLModel.queryType),
        arguments = exerciseIdArg :: Nil,
        resolve = context => context.ctx.mongoQueries.futureExerciseById(context.arg(exerciseIdArg))
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

  private def resolveChangePassword(context: Context[GraphQLContext, Unit]): Future[Boolean] = context.arg(changePasswordInputArg) match {
    case ChangePasswordInput(oldPassword, newPassword, newPasswordRepeat) if newPassword == newPasswordRepeat =>
      context.ctx.user match {
        case Some(User(username, Some(oldPasswordHash), _)) if oldPassword.isBcryptedBounded(oldPasswordHash) =>
          context.ctx.mongoQueries.futureUpdatePassword(username, newPassword.boundedBcrypt)
        case _ => Future.failed(UserFacingGraphQLError("Can't change password!"))
      }
    case _ => Future.failed(UserFacingGraphQLError("Passwords do not match!"))
  }

  private def resolveCreateExercise(context: Context[GraphQLContext, Unit]): Future[Int] = context.arg(exerciseInputArg) match {
    case GraphQLExerciseInput(title, text, sampleSolutionAsJson) =>
      for {
        sampleSolution <- readSolutionFromJsonString(sampleSolutionAsJson)

        maybeMaxExerciseId <- context.ctx.mongoQueries.futureMaxExerciseId

        exerciseId = maybeMaxExerciseId.map(_ + 1).getOrElse(0)

        _ <- context.ctx.mongoQueries.futureInsertExercise(Exercise(exerciseId, title, text, sampleSolution))
      } yield exerciseId
  }

  private def resolveExerciseMutations(context: Context[GraphQLContext, Unit]): Future[Option[Exercise]] =
    context.ctx.mongoQueries.futureExerciseById(context.arg(exerciseIdArg))

  private val mutationType = ObjectType(
    "Mutation",
    fields[GraphQLContext, Unit](
      Field("register", StringType, arguments = registerInputArg :: Nil, resolve = resolveRegistration),
      Field("login", LoginResult.queryType, arguments = loginInputArg :: Nil, resolve = resolveLogin),
      Field("changePassword", BooleanType, arguments = changePasswordInputArg :: Nil, resolve = resolveChangePassword),
      Field("createExercise", IntType, arguments = exerciseInputArg :: Nil, resolve = resolveCreateExercise),
      Field("exerciseMutations", OptionType(ExerciseGraphQLModel.mutationType), arguments = exerciseIdArg :: Nil, resolve = resolveExerciseMutations)
    )
  )

  val schema: Schema[GraphQLContext, Unit] = Schema(queryType, Some(mutationType))

}
