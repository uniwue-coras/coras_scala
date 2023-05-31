package model.graphql

import model._
import play.api.libs.json._
import sangria.execution.UserFacingError
import sangria.schema._

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

trait GraphQLModel extends RootQuery with RootMutation {

  protected val schema: Schema[GraphQLContext, Unit] = Schema(
    queryType,
    Some(mutationType)
  )

}
