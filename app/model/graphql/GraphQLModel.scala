package model.graphql

import com.github.t3hnar.bcrypt._
import model._
import play.api.libs.json.JsValue
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
    case Some(User(_, _, Rights.Admin, _)) => Success(())
    case _                                 => Failure(UserFacingGraphQLError("User is not logged in or has insufficient rights!"))
  }

}

final case class UserFacingGraphQLError(msg: String) extends Exception(msg) with UserFacingError

class GraphQLModel @Inject() (implicit ec: ExecutionContext) extends GraphQLArguments with JwtHelpers {

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

  private val mutationType = ObjectType(
    "Mutation",
    fields[GraphQLContext, Unit](
      Field(
        "register",
        StringType,
        arguments = registerInputArg :: Nil,
        resolve = context =>
          context.args.arg(registerInputArg) match {
            case RegisterInput(username, password, passwordRepeat) if password == passwordRepeat =>
              context.ctx.mongoQueries
                .futureInsertUser(User(username, Some(password.boundedBcrypt), Rights.Student, None))
                .map(_ => username)

            case _ => Future.failed(UserFacingGraphQLError("Passwords do not match!"))
          }
      ),
      Field(
        "login",
        LoginResult.queryType,
        arguments = loginInputArg :: Nil,
        resolve = { case Context(_, ctx, args, _, _, _, _, _, _, _, _, _, _, _) =>
          val LoginInput(username, password) = args.arg(loginInputArg)

          ctx.mongoQueries
            .futureMaybeUserByUsername(username)
            .transform {
              case Success(Some(User(username, Some(pwHash), rights, maybeName))) if password.isBcryptedBounded(pwHash) =>
                Success(LoginResult(username = username, name = maybeName, rights = rights, jwt = generateJwt(username)))

              case _ => Failure(UserFacingGraphQLError("Invalid combination of username and password!"))
            }
        }
      ),
      Field(
        "changePassword",
        BooleanType,
        arguments = changePasswordInputArg :: Nil,
        resolve = { case Context(_, ctx, args, _, _, _, _, _, _, _, _, _, _, _) =>
          args.arg(changePasswordInputArg) match {
            case ChangePasswordInput(oldPassword, newPassword, newPasswordRepeat) if newPassword == newPasswordRepeat =>
              ctx.user match {
                case Some(User(username, Some(oldPasswordHash), _, _)) if oldPassword.isBcryptedBounded(oldPasswordHash) =>
                  ctx.mongoQueries.futureUpdatePassword(username, newPassword.boundedBcrypt)
                case _ => Future.failed(UserFacingGraphQLError("Can't change password!"))
              }
            case _ => Future.failed(UserFacingGraphQLError("Passwords do not match!"))
          }

        }
      )
    )
  )

  val schema: Schema[GraphQLContext, Unit] = Schema(queryType, Some(mutationType))

}
