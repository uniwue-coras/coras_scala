package model

import model.exporting.{ExportedUserSolution, NodeExportable}
import model.matching.nodeMatching.TreeMatcher
import model.matching.{Match, WordAnnotator}

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

  def correct(tableDefs: TableDefs, exerciseId: Int, username: String)(implicit ec: ExecutionContext): Future[CorrectionResult] = for {
    abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
    relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

    wordAnnotator = WordAnnotator(abbreviations, relatedWordGroups.map { _.content })

    sampleSolutionNodes <- tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
    userSolutionNodes   <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)

    sampleSolutionTree = wordAnnotator.buildSolutionTree(sampleSolutionNodes)
    userSolutionTree   = wordAnnotator.buildSolutionTree(userSolutionNodes)

    defaultMatches = TreeMatcher
      .matchContainerTrees(sampleSolutionTree, userSolutionTree)
      .matches
      .map { DefaultSolutionNodeMatch.fromSolutionNodeMatch }
      .sortBy { _.sampleNodeId }

    annotationGenerator = DbAnnotationGenerator(wordAnnotator, sampleSolutionTree, userSolutionTree, username, exerciseId, tableDefs)

    annotations <- annotationGenerator.generateAnnotations(defaultMatches)
  } yield CorrectionResult(defaultMatches, annotations)
