package model

import scala.concurrent.Future

trait SolutionNodeMatchesRepository:
  self: TableDefs =>

  import profile.api._

  protected object matchesTQ extends TableQuery[MatchesTable](new MatchesTable(_)):
    def byId(username: String, exerciseId: Int, sampleNodeId: Int, userNodeId: Int) = this.filter { m =>
      m.username === username && m.exerciseId === exerciseId && m.sampleNodeId === sampleNodeId && m.userNodeId === userNodeId
    }

    def forUserNode(username: String, exerciseId: Int, userNodeId: Int): Query[MatchesTable, DbSolutionNodeMatch, Seq] =
      this.filter { m => m.username === username && m.exerciseId === exerciseId && m.userNodeId === userNodeId }

    def forSampleNode(exerciseId: Int, sampleNodeId: Int): Query[MatchesTable, DbSolutionNodeMatch, Seq] =
      this.filter { m => m.exerciseId === exerciseId && m.sampleNodeId === sampleNodeId }

  def futureMatchesForUserSolution(username: String, exerciseId: Int): Future[Seq[DbSolutionNodeMatch]] = for {
    matches <- db.run { matchesTQ.filter { m => m.username === username && m.exerciseId === exerciseId }.result }
  } yield matches.filter { _.matchStatus != MatchStatus.Deleted }

  def futureSelectMatch(username: String, exerciseId: Int, sampleNodeId: Int, userNodeId: Int): Future[Option[DbSolutionNodeMatch]] =
    db.run { matchesTQ.byId(username, exerciseId, sampleNodeId, userNodeId).result.headOption }

  def futureInsertMatch(solutionNodeMatch: DbSolutionNodeMatch): Future[Unit] = for {
    _ <- db.run(matchesTQ.insertOrUpdate(solutionNodeMatch))
  } yield ()

  def futureDeleteMatch(username: String, exerciseId: Int, sampleNodeId: Int, userNodeId: Int): Future[Unit] = for {
    _ <- db.run { matchesTQ.byId(username, exerciseId, sampleNodeId, userNodeId).map { _.matchStatus } update MatchStatus.Deleted }
  } yield ()

  def futureUpdateMatchCorrectness(username: String, exerciseId: Int, sampleNodeId: Int, userNodeId: Int, newCorrectness: Correctness): Future[Unit] = for {
    _ <- db.run { matchesTQ.byId(username, exerciseId, sampleNodeId, userNodeId).map { _.correctness } update newCorrectness }
  } yield ()

  def futureUpdateParagraphCitationCorrectness(
    username: String,
    exerciseId: Int,
    sampleNodeId: Int,
    userNodeId: Int,
    newCorrectness: Correctness
  ): Future[Unit] = for {
    _ <- db.run { matchesTQ.byId(username, exerciseId, sampleNodeId, userNodeId).map { _.paragraphCitationCorrectness } update newCorrectness }
  } yield ()

  def futureUpdateExplanationCorrectness(username: String, exerciseId: Int, sampleNodeId: Int, userNodeId: Int, newCorrectness: Correctness): Future[Unit] =
    for {
      _ <- db.run { matchesTQ.byId(username, exerciseId, sampleNodeId, userNodeId).map { _.explanationCorrectness } update newCorrectness }
    } yield ()

  def futureUpdateCorrectness(updateData: Seq[(DbSolutionNodeMatch, (Correctness, Correctness, Correctness))]): Future[Unit] = for {
    _ <- db.run {
      DBIO.sequence {
        updateData.map { (m, newCorrectnesses) =>
          matchesTQ
            .byId(m.username, m.exerciseId, m.sampleNodeId, m.userNodeId)
            .map { m => (m.correctness, m.paragraphCitationCorrectness, m.explanationCorrectness) }
            .update(newCorrectnesses)
        }
      }
    }
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

  protected class MatchesTable(tag: Tag) extends HasForeignKeyOnUserSolutionNodeTable[DbSolutionNodeMatch](tag, "solution_node_matches"):
    def sampleNodeId                 = column[Int]("sample_node_id")
    def matchStatus                  = column[MatchStatus]("match_status")
    def correctness                  = column[Correctness]("correctness")
    def paragraphCitationCorrectness = column[Correctness]("paragraph_citation_correctness")
    def explanationCorrectness       = column[Correctness]("explanation_correctness")
    def maybeCertainty               = column[Option[Double]]("maybe_certainty")

    def pk = primaryKey("solution_node_matches_pk", (username, exerciseId, sampleNodeId, userNodeId))
    def sampleEntryFk = foreignKey("sample_node_fk", (exerciseId, sampleNodeId), sampleSolutionNodesTQ)(
      sol => (sol.exerciseId, sol.id),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (
      username,
      exerciseId,
      sampleNodeId,
      userNodeId,
      matchStatus,
      correctness,
      paragraphCitationCorrectness,
      explanationCorrectness,
      maybeCertainty
    ).mapTo[DbSolutionNodeMatch]
