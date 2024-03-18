package model

import model.exporting.{ExportedUserSolution, NodeExportable}
import model.matching.SpacyWordAnnotator
import model.matching.nodeMatching.TreeMatcher
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

final case class UserSolution(
  username: String,
  exerciseId: Int,
  correctionStatus: CorrectionStatus,
  reviewUuid: Option[String]
) extends NodeExportable[ExportedUserSolution]:
  override def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedUserSolution] = for {
    userSolutionNodes         <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
    exportedUserSolutionNodes <- Future.traverse(userSolutionNodes) { _.exportData(tableDefs) }

    nodeMatches <- tableDefs.futureMatchesForUserSolution(username, exerciseId)
    exportedNodeMatches = nodeMatches.map { _.exportData }

    correctionSummary <- tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
    exportedCorrectionSummary = correctionSummary.map { _.exportData }
  } yield ExportedUserSolution(username, exportedUserSolutionNodes, exportedNodeMatches, correctionStatus, exportedCorrectionSummary)

object UserSolution:

  def correct(ws: WSClient, tableDefs: TableDefs, exerciseId: Int, username: String)(implicit ec: ExecutionContext): Future[CorrectionResult] = for {
    abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
    relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

    wordAnnotator = SpacyWordAnnotator(ws, abbreviations, relatedWordGroups.map { _.content })

    sampleSolutionNodes <- tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
    userSolutionNodes   <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)

    sampleSolutionTree <- wordAnnotator.buildSolutionTree(sampleSolutionNodes)
    userSolutionTree   <- wordAnnotator.buildSolutionTree(userSolutionNodes)

    defaultMatches = TreeMatcher
      .matchContainerTrees(sampleSolutionTree, userSolutionTree)
      .matches
      .map { m => DefaultSolutionNodeMatch.fromSolutionNodeMatch(m, sampleSolutionTree, userSolutionTree) }
      .sortBy { _.sampleNodeId }

    annotations = ParagraphAnnotationGenerator.generateAnnotations(sampleSolutionTree, userSolutionTree, defaultMatches)
  } yield CorrectionResult(defaultMatches, annotations)
