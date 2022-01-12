package model.graphql

import com.github.t3hnar.bcrypt._
import model._
import play.api.libs.json.JsValue
import sangria.execution.UserFacingError
import sangria.macros.derive.deriveObjectType
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
  tableDefs: TableDefs,
  user: Option[User]
) {

  def resolveAdmin: Try[Admin] = user match {
    case Some(User(_, _, rights, _)) if rights == Rights.Admin => Success(new Admin())
    case _                                                     => Failure(UserFacingGraphQLError("User is not logged in or has insufficient rights!"))
  }

}

final case class LoginResult(
  username: String,
  name: Option[String],
  rights: Rights,
  jwt: String
)

object LoginResult {
  val queryType: ObjectType[GraphQLContext, LoginResult] = {
    implicit val rightsType: EnumType[Rights] = Rights.graphQLType

    deriveObjectType()
  }
}

final case class UserFacingGraphQLError(msg: String) extends Exception(msg) with UserFacingError

class GraphQLModel @Inject() (implicit ec: ExecutionContext) extends GraphQLArguments with JwtHelpers {

  private val queryType = ObjectType(
    "Query",
    fields[GraphQLContext, Unit](
      Field("exercises", ListType(ExerciseGraphQLModel.queryType), resolve = _.ctx.tableDefs.futureAllExercises),
      Field(
        "exercise",
        OptionType(ExerciseGraphQLModel.queryType),
        arguments = exerciseIdArg :: Nil,
        resolve = context => context.ctx.tableDefs.futureExerciseById(context.arg(exerciseIdArg))
      ),
      Field("adminQueries", Admin.queryType, resolve = _.ctx.resolveAdmin),
      Field(
        "testDocx",
        BooleanType,
        arguments = List(),
        resolve = _ => {
          DocxReader.readDocx("corruption.docx")

          false
        }
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
        resolve = { case Context(_, ctx, args, _, _, _, _, _, _, _, _, _, _, _) =>
          args.arg(registerInputArg) match {
            case RegisterInput(username, password, passwordRepeat) if password == passwordRepeat =>
              ctx.tableDefs
                .futureInsertUser(User(username, Some(password.boundedBcrypt), Rights.Student, None))
                .transformWith {
                  case Success(true) => Future.successful(username)
                  case _             => Future.failed(UserFacingGraphQLError("Could not insert user!"))
                }

            case _ => Future.failed(UserFacingGraphQLError("Passwords do not match!"))
          }
        }
      ),
      Field(
        "login",
        LoginResult.queryType,
        arguments = loginInputArg :: Nil,
        resolve = { case Context(_, ctx, args, _, _, _, _, _, _, _, _, _, _, _) =>
          val LoginInput(username, password) = args.arg(loginInputArg)

          ctx.tableDefs
            .futureMaybeUserByName(username)
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
            case ChangePasswordInput(oldPassword, newPassword, newPasswordRepeat) if newPassword == newPasswordRepeat => ???
            case _                                                                                                    => ???
          }
        }
      ),
      Field(
        "adminMutations",
        Admin.mutationType,
        resolve = _.ctx.resolveAdmin
      ),
      Field(
        "exerciseMutations",
        OptionType(ExerciseGraphQLModel.mutationsType),
        arguments = exerciseIdArg :: Nil,
        resolve = context => context.ctx.tableDefs.futureExerciseById(context.arg(exerciseIdArg))
      )
    )
  )

  val schema: Schema[GraphQLContext, Unit] = Schema(queryType, Some(mutationType))

}
