package model

import model.exporting.{ExportedCorrectionSummary, LeafExportable}
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{Field, IntType, ObjectType, StringType, fields}

trait CorrectionSummary {
  def comment: String
  def points: Int
}

final case class DbCorrectionSummary(
  exerciseId: Int,
  username: String,
  comment: String,
  points: Int
) extends CorrectionSummary
    with LeafExportable[ExportedCorrectionSummary] {

  override def exportData: ExportedCorrectionSummary = ExportedCorrectionSummary(comment, points)

}

object CorrectionSummaryGraphQLTypes extends GraphQLBasics {
  val queryType: ObjectType[GraphQLContext, DbCorrectionSummary] = ObjectType(
    "CorrectionSummary",
    fields[GraphQLContext, DbCorrectionSummary](
      Field("comment", StringType, resolve = _.value.comment),
      Field("points", IntType, resolve = _.value.points)
    )
  )
}
