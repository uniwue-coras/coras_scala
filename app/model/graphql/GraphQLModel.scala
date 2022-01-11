package model.graphql

import model.{DocxReader, ExerciseGraphQLModel, TableDefs, User}
import play.api.libs.json.JsValue
import sangria.execution.UserFacingError
import sangria.schema._

import javax.inject.Inject
import scala.concurrent.ExecutionContext
import scala.util.{Failure, Success}

final case class GraphQLRequest(
  query: String,
  operationName: Option[String],
  variables: Option[JsValue]
)

final case class GraphQLContext(
  tableDefs: TableDefs,
  user: Option[User]
)

final case class UserFacingGraphQLError(msg: String) extends Exception(msg) with UserFacingError

class GraphQLModel @Inject() (implicit ec: ExecutionContext) extends GraphQLArguments {

  private val queryType = ObjectType(
    "Query",
    fields[GraphQLContext, Unit](
      Field("exercises", ListType(ExerciseGraphQLModel.queryType), resolve = context => context.ctx.tableDefs.futureAllExercises),
      Field(
        "exercise",
        OptionType(ExerciseGraphQLModel.queryType),
        arguments = exerciseIdArg :: Nil,
        resolve = context => context.ctx.tableDefs.futureExerciseById(context.arg(exerciseIdArg))
      ),
      Field("adminQueries", Admin.queryType, resolve = _ => ???),
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
        resolve = context => Mutations.handleRegister(context.ctx.tableDefs, context.arg(registerInputArg))
      ),
      Field(
        "login",
        LoginResult.queryType,
        arguments = loginInputArg :: Nil,
        resolve = context => Mutations.handleLogin(context.ctx.tableDefs, context.arg(loginInputArg))
      ),
      Field(
        "changePassword",
        BooleanType,
        arguments = changePasswordInputArg :: Nil,
        resolve = context => Mutations.handleChangePassword(context.ctx.tableDefs, context.arg(changePasswordInputArg))
      ),
      Field(
        "adminMutations",
        Admin.mutationType,
        resolve = _.ctx.user match {
          case None       => Failure(UserFacingGraphQLError("User is not logged in!"))
          case Some(user) => Success(new Admin())
        }
      ),
      Field(
        "exerciseMutations",
        OptionType(ExerciseGraphQLModel.mutationsType),
        arguments = exerciseIdArg :: Nil,
        resolve = context => Mutations.handleExercise(context.ctx.tableDefs, context.arg(exerciseIdArg))
      )
    )
  )

  val schema: Schema[GraphQLContext, Unit] = Schema(queryType, Some(mutationType))

}
