package model.graphql

import model.{DocxReader, Exercise, TableDefs}
import play.api.libs.json.JsValue
import sangria.execution.UserFacingError
import sangria.schema._

import javax.inject.Inject
import scala.concurrent.ExecutionContext

final case class GraphQLRequest(
  query: String,
  operationName: Option[String],
  variables: Option[JsValue]
)

final case class GraphQLContext(
  tableDefs: TableDefs
)

final case class UserFacingGraphQLError(msg: String) extends Exception(msg) with UserFacingError

class GraphQLModel @Inject() (implicit ec: ExecutionContext) extends GraphQLArguments {

  private val queryType = ObjectType(
    "Query",
    fields[GraphQLContext, Unit](
      Field("exercises", ListType(Exercise.queryType), resolve = context => Query.handleExercises(context.ctx.tableDefs)),
      Field(
        "exercise",
        OptionType(Exercise.queryType),
        arguments = exerciseIdArg :: Nil,
        resolve = context => Query.handleExercise(context.ctx.tableDefs, context.arg(exerciseIdArg))
      ),
      Field("adminQueries", Admin.queryType, resolve = _ => ???),
      // Field("x", OptionType(StringType), resolve = _ => query.futureMaybeUserByName("admin").map(_.map(_.username))),
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
      Field("adminMutations", Admin.mutationType, resolve = _ => ???),
      Field(
        "exerciseMutations",
        OptionType(Exercise.mutationsType),
        arguments = exerciseIdArg :: Nil,
        resolve = context => Mutations.handleExercise(context.ctx.tableDefs, context.arg(exerciseIdArg))
      )
    )
  )

  val schema: Schema[GraphQLContext, Unit] = Schema(queryType, Some(mutationType))

}
