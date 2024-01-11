package model

import scala.concurrent.Future

trait CorrectionSummaryRepository:
  self: TableDefs =>

  import profile.api._

  protected val correctionResultsTQ = TableQuery[CorrectionSummaryTable]

  def futureCorrectionSummaryForSolution(exerciseId: Int, username: String): Future[Option[DbCorrectionSummary]] = db.run(
    correctionResultsTQ.filter { cr => cr.exerciseId === exerciseId && cr.username === username }.result.headOption
  )

  def futureUpsertCorrectionResult(username: String, exerciseId: Int, comment: String, points: Int): Future[Boolean] = for {
    rowCount <- db.run {
      correctionResultsTQ insertOrUpdate (CorrectionSummaryKey(exerciseId, username), CorrectionSummary(comment, points))
    }
  } yield rowCount == 1

  protected class CorrectionSummaryTable(tag: Tag) extends Table[DbCorrectionSummary](tag, "correction_summaries"):
    def exerciseId = column[Int]("exercise_id")
    def username   = column[String]("username")
    def comment    = column[String]("comment")
    def points     = column[Int]("points")

    def pk = primaryKey("correction_results_pk", (exerciseId, username))
    def userSolutionsFk = foreignKey("correction_results_user_solutions_fk", (exerciseId, username), userSolutionsTQ)(
      userSolution => (userSolution.exerciseId, userSolution.username),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * = (
      (exerciseId, username).mapTo[CorrectionSummaryKey],
      (comment, points).mapTo[CorrectionSummary]
    )
