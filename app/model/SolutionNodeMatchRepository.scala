package model

import scala.concurrent.Future

final case class SolutionNodeMatchKey(exerciseId: Int, username: String, sampleNodeId: Int, userNodeId: Int)

trait SolutionNodeMatchesRepository {
  self: TableDefs =>

  import profile.api._

  protected object matchesTQ extends TableQuery[MatchesTable](new MatchesTable(_)) {
    def byKey(key: SolutionNodeMatchKey) = this.filter { m =>
      m.exerciseId === key.exerciseId && m.username === key.username && m.sampleNodeId === key.sampleNodeId && m.userNodeId === key.userNodeId
    }

    def forUserNode(username: String, exerciseId: Int, userNodeId: Int): Query[MatchesTable, DbSolutionNodeMatch, Seq] =
      this.filter { m => m.username === username && m.exerciseId === exerciseId && m.userNodeId === userNodeId }

    def forSampleNode(exerciseId: Int, sampleNodeId: Int): Query[MatchesTable, DbSolutionNodeMatch, Seq] =
      this.filter { m => m.exerciseId === exerciseId && m.sampleNodeId === sampleNodeId }
  }

  def futureMatchesForUserSolution(username: String, exerciseId: Int): Future[Seq[DbSolutionNodeMatch]] = for {
    matches <- db.run { matchesTQ.filter { m => m.username === username && m.exerciseId === exerciseId }.result }
  } yield matches.filter { _.matchStatus != MatchStatus.Deleted }

  def futureSelectMatch(key: SolutionNodeMatchKey): Future[Option[DbSolutionNodeMatch]] = db.run { matchesTQ.byKey { key }.result.headOption }

  def futureDeleteMatch(key: SolutionNodeMatchKey): Future[Unit] = for {
    _ <- db.run { matchesTQ.byKey { key }.map { _.matchStatus } update MatchStatus.Deleted }
  } yield ()

  def futureUpdateParCitCorrectness(key: SolutionNodeMatchKey, newCorrectness: Correctness): Future[Unit] = for {
    _ <- db.run { matchesTQ.byKey { key }.map { _.paragraphCitationCorrectness } update newCorrectness }
  } yield ()

  def futureUpdateExplanationCorrectness(key: SolutionNodeMatchKey, newCorrectness: Correctness): Future[Unit] = for {
    _ <- db.run { matchesTQ.byKey { key }.map { _.explanationCorrectness } update newCorrectness }
  } yield ()

  protected class MatchesTable(tag: Tag) extends Table[DbSolutionNodeMatch](tag, "solution_node_matches") {
    def username                     = column[String]("username")
    def exerciseId                   = column[Int]("exercise_id")
    def sampleNodeId                 = column[Int]("sample_node_id")
    def userNodeId                   = column[Int]("user_node_id")
    def matchStatus                  = column[MatchStatus]("match_status")
    def paragraphCitationCorrectness = column[Correctness]("paragraph_citation_correctness")
    def explanationCorrectness       = column[Correctness]("explanation_correctness")
    def maybeCertainty               = column[Option[Double]]("maybe_certainty")

    def pkDef = primaryKey("solution_node_matches_pk", (username, exerciseId, sampleNodeId, userNodeId))
    def sampleEntryFk = foreignKey("sample_node_fk", (exerciseId, sampleNodeId), sampleSolutionNodesTQ)(
      sol => (sol.exerciseId, sol.id),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )
    def userNodeFk = foreignKey("user_node_fk", (username, exerciseId, userNodeId), userSolutionNodesTQ)(
      node => (node.username, node.exerciseId, node.id),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * = (username, exerciseId, sampleNodeId, userNodeId, paragraphCitationCorrectness, explanationCorrectness, maybeCertainty, matchStatus)
      .mapTo[DbSolutionNodeMatch]
  }
}
