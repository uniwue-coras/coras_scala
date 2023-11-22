package model

import model.exporting.{ExportedCorrectionSummary, LeafExportable}
import model.graphql.{GraphQLContext, MyQueryType}
import sangria.schema.{Field, IntType, ObjectType, StringType, fields}

import scala.concurrent.Future

trait CorrectionSummary:
  def comment: String
  def points: Int

final case class DbCorrectionSummary(
  exerciseId: Int,
  username: String,
  comment: String,
  points: Int
) extends CorrectionSummary
    with LeafExportable[ExportedCorrectionSummary]:
  override def exportData: ExportedCorrectionSummary = ExportedCorrectionSummary(comment, points)

object CorrectionSummaryGraphQLTypes extends MyQueryType[DbCorrectionSummary]:
  override val queryType: ObjectType[GraphQLContext, DbCorrectionSummary] = ObjectType(
    "CorrectionSummary",
    fields[GraphQLContext, DbCorrectionSummary](
      Field("comment", StringType, resolve = _.value.comment),
      Field("points", IntType, resolve = _.value.points)
    )
  )

trait CorrectionSummaryRepository:
  self: TableDefs =>

  import profile.api._

  private val correctionResultsTQ = TableQuery[CorrectionSummaryTable]

  def futureCorrectionSummaryForSolution(exerciseId: Int, username: String): Future[Option[DbCorrectionSummary]] = db.run(
    correctionResultsTQ.filter { cr => cr.exerciseId === exerciseId && cr.username === username }.result.headOption
  )

  def futureUpsertCorrectionResult(username: String, exerciseId: Int, comment: String, points: Int): Future[Boolean] = for {
    rowCount <- db.run { correctionResultsTQ insertOrUpdate DbCorrectionSummary(exerciseId, username, comment, points) }
  } yield rowCount == 1

  private class CorrectionSummaryTable(tag: Tag) extends Table[DbCorrectionSummary](tag, "correction_summaries"):
    def exerciseId      = column[Int]("exercise_id")
    def username        = column[String]("username")
    private def comment = column[String]("comment")
    private def points  = column[Int]("points")

    def pk = primaryKey("correction_results_pk", (exerciseId, username))
    def userSolutionsFk = foreignKey("correction_results_user_solutions_fk", (exerciseId, username), userSolutionsTQ)(
      userSolution => (userSolution.exerciseId, userSolution.username),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * = (exerciseId, username, comment, points).mapTo[DbCorrectionSummary]
