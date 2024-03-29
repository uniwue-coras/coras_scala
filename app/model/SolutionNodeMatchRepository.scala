package model

import scala.concurrent.Future

trait SolutionNodeMatchesRepository:
  self: TableDefs =>

  import profile.api._

  protected object matchesTQ extends TableQuery[MatchesTable](new MatchesTable(_)):
    def forUserNode(username: String, exerciseId: Int, userNodeId: Int): Query[MatchesTable, DbSolutionNodeMatch, Seq] =
      this.filter { m => m.username === username && m.exerciseId === exerciseId && m.userNodeId === userNodeId }

    def forSampleNode(exerciseId: Int, sampleNodeId: Int): Query[MatchesTable, DbSolutionNodeMatch, Seq] =
      this.filter { m => m.exerciseId === exerciseId && m.sampleNodeId === sampleNodeId }

  def futureMatchesForUserSolution(username: String, exerciseId: Int): Future[Seq[DbSolutionNodeMatch]] = for {
    matches <- db.run { matchesTQ.filter { m => m.username === username && m.exerciseId === exerciseId }.result }
  } yield matches.filter { _.matchStatus != MatchStatus.Deleted }

  def futureInsertMatch(solutionNodeMatch: DbSolutionNodeMatch): Future[Unit] = for {
    _ <- db.run(matchesTQ.insertOrUpdate(solutionNodeMatch))
  } yield ()

  private def annotationIsForUserNode(annotation: UserSolutionNodeAnnotationsTable, userSolutionNode: UserSolutionNodesTable): Rep[Boolean] =
    annotation.username === userSolutionNode.username && annotation.exerciseId === userSolutionNode.exerciseId && annotation.userNodeId === userSolutionNode.id

  def futureFindOtherCorrectedUserNodes(username: String, exerciseId: Int, userNodeId: Int): Future[Seq[(DbAnnotation, String)]] = db.run {
    (for {
      // Find current node
      aMatch <- matchesTQ.forUserNode(username, exerciseId, userNodeId)
      // find matches user solution node
      userSolutionNode <- aMatch.userNodeFk
      // find annotations for user sol node
      annotation <- annotationsTQ if annotationIsForUserNode(annotation, userSolutionNode)

    } yield (annotation, userSolutionNode.text)).result
  }

  def futureSelectUserSolNodesMatchedToSampleSolNode(exerciseId: Int, sampleNodeId: Int): Future[Seq[(UserSolutionNode, DbAnnotation)]] = db.run {
    (for {
      aMatch <- matchesTQ.forSampleNode(exerciseId, sampleNodeId)

      // find (other) matched user sol nodes
      userSolutionNode <- aMatch.userNodeFk

      // find annotations for user sol nodes
      annotation <- annotationsTQ if annotationIsForUserNode(annotation, userSolutionNode)
    } yield (userSolutionNode, annotation)).result
  }

  def futureDeleteMatch(username: String, exerciseId: Int, sampleNodeId: Int, userNodeId: Int): Future[Unit] = for {
    _ <- db.run(
      matchesTQ
        .filter { m => m.username === username && m.exerciseId === exerciseId && m.sampleNodeId === sampleNodeId && m.userNodeId === userNodeId }
        .map(_.matchStatus)
        .update(MatchStatus.Deleted)
    )
  } yield ()

  protected class MatchesTable(tag: Tag) extends HasForeignKeyOnUserSolutionNodeTable[DbSolutionNodeMatch](tag, "solution_node_matches"):
    def sampleNodeId   = column[Int]("sample_node_id")
    def matchStatus    = column[MatchStatus]("match_status")
    def maybeCertainty = column[Option[Double]]("maybe_certainty")

    def pk = primaryKey("solution_node_matches_pk", (username, exerciseId, sampleNodeId, userNodeId))
    def sampleEntryFk =
      foreignKey("sample_node_fk", (exerciseId, sampleNodeId), sampleSolutionNodesTQ)(sol => (sol.exerciseId, sol.id), onUpdate = cascade, onDelete = cascade)

    override def * = (username, exerciseId, sampleNodeId, userNodeId, matchStatus, maybeCertainty).mapTo[DbSolutionNodeMatch]
