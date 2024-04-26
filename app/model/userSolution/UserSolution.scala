package model.userSolution

import model._
import model.exporting.{ExportedUserSolution, NodeExportable}
import model.matching.nodeMatching.{AnnotatedSampleSolutionTree, AnnotatedSolutionNodeMatcher, AnnotatedUserSolutionTree, TreeMatcher}
import model.matching.{Match, SpacyWordAnnotator, WordAnnotator}
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

final case class UserSolution(
  username: String,
  exerciseId: Int,
  correctionStatus: CorrectionStatus,
  reviewUuid: Option[String]
) extends NodeExportable[ExportedUserSolution]:
  override def exportData(tableDefs: TableDefs)(using ExecutionContext): Future[ExportedUserSolution] = for {
    userSolutionNodes         <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
    exportedUserSolutionNodes <- Future.traverse(userSolutionNodes) { _.exportData(tableDefs) }

    nodeMatches <- tableDefs.futureMatchesForUserSolution(username, exerciseId)
    exportedNodeMatches = nodeMatches.map { _.exportData }

    correctionSummary <- tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
    exportedCorrectionSummary = correctionSummary.map { _.exportData }
  } yield ExportedUserSolution(username, exportedUserSolutionNodes, exportedNodeMatches, correctionStatus, exportedCorrectionSummary)

  def recalculateCorrectness(
    tableDefs: TableDefs,
    wordAnnotator: WordAnnotator
  )(using
    sampleTree: AnnotatedSampleSolutionTree,
    ec: ExecutionContext
  ): Future[(Seq[(DbSolutionNodeMatch, (Correctness, Correctness, Seq[DbParagraphCitationAnnotation]))])] = for {

    userSolutionNodes                          <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
    userTree @ given AnnotatedUserSolutionTree <- wordAnnotator.buildUserSolutionTree(userSolutionNodes)
    matches                                    <- tableDefs.futureMatchesForUserSolution(username, exerciseId)

    nodeMatcher = AnnotatedSolutionNodeMatcher(sampleTree, userTree)

    updateData = matches.map { dbMatch =>
      val sampleNode = sampleTree.find(dbMatch.sampleNodeId).get
      val userNode   = userTree.find(dbMatch.userNodeId).get

      val maybeExplanation = nodeMatcher.explainIfNotCorrect(sampleNode, userNode)

      val defMatch = GeneratedSolutionNodeMatch.fromSolutionNodeMatch(Match(sampleNode, userNode, maybeExplanation))

      val parCitAnnots = defMatch.paragraphCitationAnnotations.map { _.forDb(exerciseId, username) }

      val parCitCorrectness = if parCitAnnots.isEmpty then Correctness.Unspecified else Correctness.Partially
      val explCorrectness   = defMatch.explanationCorrectness

      dbMatch -> (parCitCorrectness, explCorrectness, parCitAnnots)
    }
  } yield updateData

object UserSolution:
  def correct(ws: WSClient, tableDefs: TableDefs, exerciseId: Int, username: String)(using ExecutionContext): Future[CorrectionResult] = for {
    abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
    relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

    wordAnnotator = SpacyWordAnnotator(ws, abbreviations, relatedWordGroups.map { _.content })

    sampleSolutionNodes <- tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
    userSolutionNodes   <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)

    sampleSolutionTree @ given AnnotatedSampleSolutionTree <- wordAnnotator.buildSampleSolutionTree(sampleSolutionNodes)
    userSolutionTree @ given AnnotatedUserSolutionTree     <- wordAnnotator.buildUserSolutionTree(userSolutionNodes)

    defaultMatches = TreeMatcher
      .matchContainerTrees(sampleSolutionTree, userSolutionTree)
      .matches
      .map { GeneratedSolutionNodeMatch.fromSolutionNodeMatch }
      .sortBy { _.sampleNodeId }

    // TODO: becomes different class!
    annotations = ParagraphAnnotationGenerator.generateAnnotations(sampleSolutionTree, userSolutionTree, defaultMatches)

    paragraphCitationAnnotations = Seq.empty
  } yield CorrectionResult(defaultMatches, annotations, paragraphCitationAnnotations)
