package model

import model.matching.NodeIdMatch

import scala.concurrent.Future

trait SolutionNodeMatchesRepository {
  self: TableDefs =>

  import profile.api._

  private type CorrectionRow = (String, Int, Int, Int, Option[Double])

  private object correctionsTQ extends TableQuery[CorrectionsTable](new CorrectionsTable(_)) {
    def forExAndUser(exerciseId: Int, username: String): Query[CorrectionsTable, CorrectionRow, Seq] = correctionsTQ.filter { corr =>
      corr.exerciseId === exerciseId && corr.username === username
    }
  }

  /*
  def futureCorrectionForExerciseAndUser(exerciseId: Int, username: String): Future[Option[SolutionNodeMatchingResult]] = for {
    mongoCorrection <- db.run(correctionsTQ.forExAndUser(exerciseId, username).result.headOption)
  } yield mongoCorrection.map(_._3)
   */

  def futureUsersWithCorrection(exerciseId: Int): Future[Seq[String]] = db.run(
    correctionsTQ
      .filter { _.exerciseId === exerciseId }
      .map { _.username }
      .distinct
      .result
  )

  def futureUserHasCorrection(exerciseId: Int, username: String): Future[Boolean] = for {
    lineCount <- db.run(correctionsTQ.forExAndUser(exerciseId, username).length.result)
  } yield lineCount > 0

  def futureInsertCorrection(exerciseId: Int, username: String, correction: Seq[NodeIdMatch]): Future[Unit] = {
    val data = correction.map { case NodeIdMatch(sampleValue, userValue, maybeCertainty) =>
      (username, exerciseId, sampleValue, userValue, maybeCertainty.map(_.rate))
    }

    for {
      _ <- db.run(correctionsTQ ++= data)
    } yield ()
  }

  def futureDeleteCorrection(exerciseId: Int, username: String): Future[Unit] = for {
    _ <- db.run(correctionsTQ.forExAndUser(exerciseId, username).delete)
  } yield ()

  private class CorrectionsTable(tag: Tag) extends Table[CorrectionRow](tag, "solution_node_matches") {

    def username = column[String]("username")

    def exerciseId = column[Int]("exercise_id")

    def sampleNodeId = column[Int]("sample_node_id")

    def userNodeId = column[Int]("user_node_id")

    def maybeCertainty = column[Option[Double]]("maybe_certainty")

    def pk = primaryKey("solution_node_matches_pk", (username, exerciseId, sampleNodeId, userNodeId))

    def sampleEntryFk = foreignKey("solution_node_matches_sample_node_fk", (exerciseId, sampleNodeId), sampleSolutionNodesTQ)(
      sol => (sol.exerciseId, sol.id),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    def userEntryFk = foreignKey("solution_node_matches_user_node_fk", (username, exerciseId, userNodeId), userSolutionNodesTQ)(
      sol => (sol.username, sol.exerciseId, sol.id),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (username, exerciseId, sampleNodeId, userNodeId, maybeCertainty)

  }

}
