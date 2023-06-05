package model

import scala.annotation.unused
import scala.concurrent.Future

final case class CorrectionSummaryInput(
  comment: String,
  points: Int
)

final case class CorrectionSummary(
  exerciseId: Int,
  username: String,
  comment: String,
  points: Int
)

trait CorrectionSummaryRepository {
  self: TableDefs =>

  import profile.api._

  private val correctionResultsTQ = TableQuery[CorrectionSummaryTable]

  def futureCorrectionSummaryForSolution(exerciseId: Int, username: String): Future[Option[CorrectionSummary]] = db.run(
    correctionResultsTQ.filter { corrResult => corrResult.exerciseId === exerciseId && corrResult.username === username }.result.headOption
  )

  def futureUpsertCorrectionResult(correctionResult: CorrectionSummary): Future[Boolean] = for {
    rowCount <- db.run(correctionResultsTQ insertOrUpdate correctionResult)
  } yield rowCount == 1

  private class CorrectionSummaryTable(tag: Tag) extends Table[CorrectionSummary](tag, "correction_summaries") {
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

    override def * = (exerciseId, username, comment, points) <> (CorrectionSummary.tupled, CorrectionSummary.unapply)
  }

}
