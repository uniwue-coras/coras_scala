package model

import play.api.libs.json.JsValue
import sangria.schema._

final case class GraphQLRequest(
  query: String,
  operationName: Option[String],
  variables: Option[JsValue]
)

class GraphQLModel /*@Inject()*/ () {

  private val queryType = ObjectType(
    "Query",
    fields[Unit, Unit](
      Field("x", StringType, resolve = _ => "Hello!")
    )
  )

  val schema: Schema[Unit, Unit] = Schema(queryType, None)

}
