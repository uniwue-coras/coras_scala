package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{Field, IntType, ObjectType, StringType, fields}

final case class CorrectionSummaryKey(
  exerciseId: Int,
  username: String
)

final case class CorrectionSummary(
  comment: String,
  points: Int
)

type DbCorrectionSummary = (CorrectionSummaryKey, CorrectionSummary)

object CorrectionSummaryGraphQLTypes extends GraphQLBasics:
  val queryType: ObjectType[GraphQLContext, DbCorrectionSummary] = ObjectType(
    "CorrectionSummary",
    fields[GraphQLContext, DbCorrectionSummary](
      Field("comment", StringType, resolve = _.value._2.comment),
      Field("points", IntType, resolve = _.value._2.points)
    )
  )
