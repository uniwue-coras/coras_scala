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

  def futureMatchesForUserSolution(username: String, exerciseId: Int): Future[Seq[SolutionNodeMatch]] = for {
    matches <- db.run { matchesTQ.filter { m => m.username === username && m.exerciseId === exerciseId }.result }
  } yield matches.filter { _.matchStatus != MatchStatus.Deleted }

  def futureInsertMatch(solutionNodeMatch: SolutionNodeMatch): Future[Unit] = for {
    _ <- db.run(matchesTQ.insertOrUpdate(solutionNodeMatch))
  } yield ()

  def futureFindOtherCorrectedUserNodes(username: String, exerciseId: Int, userNodeId: Int): Future[Seq[(Annotation, String)]] = db.run(
    matchesTQ
      // find current node
      .filter { m => m.username === username && m.exerciseId === exerciseId && m.userNodeId === userNodeId }
      // find other user sol nodes that were matched with same sample sol nodes
      .join(matchesTQ)
      .on { case (m1, m2) => m1.exerciseId === m2.exerciseId && m1.sampleNodeId === m2.sampleNodeId && m1.username =!= m2.username }
      .map { _._2 }
      // find annotations for said user sol nodes
      .join(annotationsTQ)
      .on { case (m, a) => m.username === a.username && m.exerciseId === a.exerciseId && m.userNodeId === a.userNodeId }
      .map { case (_, a) => a }
      // join for node text
      .join(userSolutionNodesTQ)
      .on { case (a, n) => a.username === n.username && a.exerciseId === n.exerciseId && a.userNodeId === n.id }
      .map { case (a, n) => (a, n.text) }
      .result
  )

  def futureDeleteMatch(username: String, exerciseId: Int, sampleNodeId: Int, userNodeId: Int): Future[Unit] = for {
    _ <- db.run(
      matchesTQ
        .filter { m => m.username === username && m.exerciseId === exerciseId && m.sampleNodeId === sampleNodeId && m.userNodeId === userNodeId }
        .map(_.matchStatus)
        .update(MatchStatus.Deleted)
    )
  } yield ()

  protected class MatchesTable(tag: Tag) extends HasForeignKeyOnUserSolutionNodeTable[SolutionNodeMatch](tag, "solution_node_matches") {
    def sampleNodeId           = column[Int]("sample_node_id")
    def matchStatus            = column[MatchStatus]("match_status")
    private def maybeCertainty = column[Option[Double]]("maybe_certainty")

    @unused def pk = primaryKey("solution_node_matches_pk", (username, exerciseId, sampleNodeId, userNodeId))

    @unused def sampleEntryFk =
      foreignKey("sample_node_fk", (exerciseId, sampleNodeId), sampleSolutionNodesTQ)(sol => (sol.exerciseId, sol.id), onUpdate = cascade, onDelete = cascade)

    override def * = (username, exerciseId, sampleNodeId, userNodeId, matchStatus, maybeCertainty) <> (SolutionNodeMatch.tupled, SolutionNodeMatch.unapply)
  }

}
