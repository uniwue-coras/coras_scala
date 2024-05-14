package model.userSolution

import model._
import model.exporting.{ExportedUserSolution, NodeExportable}
import model.matching.nodeMatching.{AnnotatedSampleSolutionTree, AnnotatedSolutionNodeMatcher, TreeMatcher}
import model.matching.{Match, SpacyWordAnnotator, WordAnnotator}
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

final case class UserSolution(
  username: String,
  exerciseId: Int,
  correctionFinished: Boolean = false,
  reviewUuid: Option[String] = None
) extends NodeExportable[ExportedUserSolution] {

  def dbKey = UserSolutionKey(exerciseId, username)

  override def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedUserSolution] = for {
    userSolutionNodes         <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
    exportedUserSolutionNodes <- Future.traverse(userSolutionNodes) { _.exportData(tableDefs) }

    nodeMatches <- tableDefs.futureMatchesForUserSolution(username, exerciseId)
    exportedNodeMatches = nodeMatches.map { _.exportData }

    correctionSummary <- tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
    exportedCorrectionSummary = correctionSummary.map { _.exportData }
  } yield ExportedUserSolution(username, exportedUserSolutionNodes, exportedNodeMatches, exportedCorrectionSummary)

  @deprecated("only used for update purposes!")
  def recalculateCorrectness(
    tableDefs: TableDefs,
    wordAnnotator: WordAnnotator
  )(implicit
    sampleTree: AnnotatedSampleSolutionTree,
    ec: ExecutionContext
  ): Future[(Seq[(DbSolutionNodeMatch, (Correctness, Correctness, Seq[DbParagraphCitationAnnotation]))])] = for {

    userSolutionNodes <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
    userTree          <- wordAnnotator.buildUserSolutionTree(userSolutionNodes)
    matches           <- tableDefs.futureMatchesForUserSolution(username, exerciseId)

    nodeMatcher = new AnnotatedSolutionNodeMatcher(sampleTree, userTree)

    updateData = matches.map { dbMatch =>
      val sampleNode = sampleTree.find(dbMatch.sampleNodeId).get
      val userNode   = userTree.find(dbMatch.userNodeId).get

      val maybeExplanation = nodeMatcher.explainIfNotCorrect(sampleNode, userNode)

      val defMatch = GeneratedSolutionNodeMatch.fromSolutionNodeMatch(Match(sampleNode, userNode, maybeExplanation))(sampleTree, userTree)

      val parCitAnnots = defMatch.paragraphCitationAnnotations.map { _.forDb(exerciseId, username) }

      val parCitCorrectness = if (parCitAnnots.isEmpty) Correctness.Unspecified else Correctness.Partially
      val explCorrectness   = defMatch.explanationCorrectness

      dbMatch -> (parCitCorrectness, explCorrectness, parCitAnnots)
    }
  } yield updateData
}

object UserSolution {
  def correct(ws: WSClient, tableDefs: TableDefs, exerciseId: Int, username: String)(implicit ec: ExecutionContext): Future[Seq[GeneratedSolutionNodeMatch]] =
    for {
      abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
      relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

      wordAnnotator = new SpacyWordAnnotator(ws, abbreviations, relatedWordGroups.map { _.content })

      sampleSolutionNodes <- tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
      userSolutionNodes   <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)

      sampleSolutionTree <- wordAnnotator.buildSampleSolutionTree(sampleSolutionNodes)
      userSolutionTree   <- wordAnnotator.buildUserSolutionTree(userSolutionNodes)

      generatedMatches = TreeMatcher
        .matchContainerTrees(sampleSolutionTree, userSolutionTree)
        .matches
        .map { m => GeneratedSolutionNodeMatch.fromSolutionNodeMatch(m)(sampleSolutionTree, userSolutionTree) }
        .sortBy { _.sampleNodeId }
    } yield generatedMatches
}
