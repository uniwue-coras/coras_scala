package model

import sangria.schema.{ObjectType, fields, Field, IntType}
import model.graphql.GraphQLContext

final case class ParagraphCitationAnnotation(
  exerciseId: Int,
  username: String,
  sampleNodeId: Int,
  userNodeId: Int,
  errorType: ErrorType
)

object ParagraphCitationAnnotation:
  val queryType: ObjectType[GraphQLContext, ParagraphCitationAnnotation] = ObjectType(
    "ParagraphCitationAnnotation",
    fields[GraphQLContext, ParagraphCitationAnnotation](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("errorType", ErrorType.graphQLType, resolve = _.value.errorType)
    )
  )
