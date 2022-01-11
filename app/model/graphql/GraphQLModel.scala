package model.graphql

import model.{DocxReader, TableDefs}
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

final case class RegisterError(msg: String) extends Exception(msg) with UserFacingError

class GraphQLModel @Inject() (tableDefs: TableDefs, mutations: Mutations)(implicit ec: ExecutionContext) extends GraphQLArguments {

  private val queryType = ObjectType(
    "Query",
    fields[Unit, Unit](
      Field("x", OptionType(StringType), resolve = _ => tableDefs.futureMaybeUserByName("admin").map(_.map(_.username))),
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

  private val mutationType = ObjectType(
    "Mutation",
    fields[Unit, Unit](
      Field("register", StringType, arguments = registerInputArg :: Nil, resolve = context => mutations.handleRegister(context.arg(registerInputArg))),
      Field("login", StringType, arguments = loginInputArg :: Nil, resolve = context => mutations.handleLogin(context.arg(loginInputArg)))
    )
  )

  val schema: Schema[Unit, Unit] = Schema(queryType, Some(mutationType))

}
