package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{Field, IntType, ObjectType, StringType, fields}

final case class CorrectionSummary(
  exerciseId: Int,
  username: String,
  comment: String,
  points: Int
)

object CorrectionSummaryGraphQLTypes extends GraphQLBasics {
  val queryType: ObjectType[GraphQLContext, CorrectionSummary] = ObjectType(
    "CorrectionSummary",
    fields[GraphQLContext, CorrectionSummary](
      Field("comment", StringType, resolve = _.value.comment),
      Field("points", IntType, resolve = _.value.points)
    )
  )
}
