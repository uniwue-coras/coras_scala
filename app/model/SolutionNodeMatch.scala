package model

import scala.annotation.unused
import scala.concurrent.Future

final case class SolutionNodeMatch(
  username: String,
  exerciseId: Int,
  sampleValue: Int,
  userValue: Int,
  matchStatus: MatchStatus,
  certainty: Option[Double] = None
)

trait SolutionNodeMatchesRepository {
  self: TableDefs =>

  import profile.api._

  protected val matchesTQ = TableQuery[MatchesTable]

  def futureMatchesForUserSolution(username: String, exerciseId: Int): Future[Seq[SolutionNodeMatch]] = db.run {
    matchesTQ.filter { m => m.username === username && m.exerciseId === exerciseId }.result
  }

  def futureInsertMatch(solutionNodeMatch: SolutionNodeMatch): Future[Unit] = for {
    _ <- db.run(matchesTQ += solutionNodeMatch)
  } yield ()

  protected class MatchesTable(tag: Tag) extends Table[SolutionNodeMatch](tag, "solution_node_matches") {
    def username               = column[String]("username")
    def exerciseId             = column[Int]("exercise_id")
    private def sampleNodeId   = column[Int]("sample_node_id")
    def userNodeId             = column[Int]("user_node_id")
    def matchStatus            = column[MatchStatus]("match_status")
    private def maybeCertainty = column[Option[Double]]("maybe_certainty")

    @unused
    def pk = primaryKey("solution_node_matches_pk", (username, exerciseId, sampleNodeId, userNodeId))

    @unused
    def sampleEntryFk =
      foreignKey("sample_node_fk", (exerciseId, sampleNodeId), sampleSolutionNodesTQ)(sol => (sol.exerciseId, sol.id), onUpdate = cascade, onDelete = cascade)

    @unused
    def userEntryFk = foreignKey("user_node_fk", (username, exerciseId, userNodeId), userSolutionNodesTQ)(
      sol => (sol.username, sol.exerciseId, sol.id),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * = (username, exerciseId, sampleNodeId, userNodeId, matchStatus, maybeCertainty) <> (SolutionNodeMatch.tupled, SolutionNodeMatch.unapply)
  }

}
