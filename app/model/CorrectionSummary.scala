package model

import model.exporting.{ExportedCorrectionSummary, LeafExportable}
import model.graphql.{GraphQLContext, QueryType}
import sangria.macros.derive.{ExcludeFields, ObjectTypeName, deriveObjectType}
import sangria.schema.ObjectType

import scala.annotation.unused
import scala.concurrent.Future

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

object CorrectionSummaryGraphQLTypes extends QueryType[DbCorrectionSummary] {
  override val queryType: ObjectType[GraphQLContext, DbCorrectionSummary] = deriveObjectType(
    ObjectTypeName("CorrectionSummary"),
    ExcludeFields("exerciseId", "username")
  )
}

trait CorrectionSummaryRepository {
  self: TableDefs =>

  import profile.api._

  private val correctionResultsTQ = TableQuery[CorrectionSummaryTable]

  def futureCorrectionSummaryForSolution(exerciseId: Int, username: String): Future[Option[DbCorrectionSummary]] = db.run(
    correctionResultsTQ.filter { cr => cr.exerciseId === exerciseId && cr.username === username }.result.headOption
  )

  def futureUpsertCorrectionResult(username: String, exerciseId: Int, comment: String, points: Int): Future[Boolean] = for {
    rowCount <- db.run { correctionResultsTQ insertOrUpdate DbCorrectionSummary(exerciseId, username, comment, points) }
  } yield rowCount == 1

  private class CorrectionSummaryTable(tag: Tag) extends Table[DbCorrectionSummary](tag, "correction_summaries") {
    def exerciseId      = column[Int]("exercise_id")
    def username        = column[String]("username")
    private def comment = column[String]("comment")
    private def points  = column[Int]("points")

    @unused def pk = primaryKey("correction_results_pk", (exerciseId, username))
    @unused def userSolutionsFk = foreignKey("correction_results_user_solutions_fk", (exerciseId, username), userSolutionsTQ)(
      userSolution => (userSolution.exerciseId, userSolution.username),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * = (exerciseId, username, comment, points) <> (DbCorrectionSummary.tupled, DbCorrectionSummary.unapply)
  }

}
