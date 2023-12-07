package corasEvaluator

import model.exporting.{ExportedFlatSampleSolutionNode, ExportedFlatUserSolutionNode, ExportedSolutionNodeMatch, ExportedUserSolution}
import model.matching.MatchingResult
import model.{ExportedRelatedWord, MatchStatus}

import scala.concurrent.{ExecutionContext, Future}

type ExerciseToEvaluate = (Int, Seq[ExportedFlatSampleSolutionNode], Seq[ExportedUserSolution])

class NodeMatchingEvaluator(
  abbreviations: Map[String, String],
  relatedWordGroups: Seq[Seq[ExportedRelatedWord]]
) {

  private def evaluateSingleSolution(
    treeMatcher: EvaluatorTreeMatcher,
    goldNodeMatches: Seq[ExportedSolutionNodeMatch],
    sampleNodes: Seq[ExportedFlatSampleSolutionNode],
    userNodes: Seq[ExportedFlatUserSolutionNode]
  )(implicit ec: ExecutionContext): Future[EvalResults] = Future {

    // perform current matching
    val foundNodeMatches = treeMatcher.performMatching(sampleNodes, userNodes)

    ProgressMonitor.updateInitialMatchingProgress()

    // evaluate current matching
    val MatchingResult(
      correctNodeMatches,
      notMatchedSampleMatches,
      notMatchedUserMatches
    ) = NodeMatchMatcher.performMatching(goldNodeMatches, foundNodeMatches)

    ProgressMonitor.updateMatchingEvaluationProgress()

    // TODO: evaluate falseNeg + falsePos

    val (certainFalseNegativeTexts, fuzzyFalseNegativeTexts) =
      notMatchedSampleMatches.foldLeft((Seq[CertainDebugExplanation](), Seq[FuzzyFalseNegativeDebugExplanation]())) {
        case ((certains, fuzzies), ExportedSolutionNodeMatch(sampleNodeId, userNodeId, _, maybeCertainty)) =>
          val sampleText = sampleNodes.find(_.id == sampleNodeId).get.text
          val userText   = userNodes.find(_.id == userNodeId).get.text

          maybeCertainty match
            case None            => (certains :+ CertainDebugExplanation(sampleNodeId, sampleText, userNodeId, userText), fuzzies)
            case Some(certainty) => (certains, fuzzies :+ FuzzyFalseNegativeDebugExplanation(sampleNodeId, sampleText, userNodeId, userText, certainty))
      }

    val (certainFalsePositiveTexts, fuzzyFalsePositiveTexts) =
      notMatchedUserMatches.foldLeft((Seq[CertainDebugExplanation](), Seq[FuzzyFalsePositiveDebugExplanation]())) {
        case ((certains, fuzzies), EvaluationNodeMatch(sampleNodeId, userNodeId, maybeExplanation)) =>
          val sampleText = sampleNodes.find(_.id == sampleNodeId).get.text
          val userText   = userNodes.find(_.id == userNodeId).get.text

          maybeExplanation match
            case None              => (certains :+ CertainDebugExplanation(sampleNodeId, sampleText, userNodeId, userText), fuzzies)
            case Some(explanation) => (certains, fuzzies :+ FuzzyFalsePositiveDebugExplanation(sampleNodeId, sampleText, userNodeId, userText, explanation))
      }

    ProgressMonitor.updateMappingProgress()

    EvalResults(
      truePositiveCount = correctNodeMatches.length,
      foundMatching = foundNodeMatches,
      certainFalsePositiveTexts = certainFalsePositiveTexts,
      fuzzyFalsePositiveTexts = fuzzyFalsePositiveTexts,
      certainFalseNegativeTexts = certainFalseNegativeTexts,
      fuzzyFalseNegativeTexts = fuzzyFalseNegativeTexts
    )
  }

  def evaluateNodeMatching(exercises: Seq[ExerciseToEvaluate])(implicit ec: ExecutionContext): Future[Seq[(Int, Seq[(String, EvalResults)])]] = {

    val treeMatcher = new EvaluatorTreeMatcher(abbreviations, relatedWordGroups)

    Future.traverse(exercises) { (exerciseId, sampleSolution, userSolutions) =>
      for {
        result <- Future.traverse(userSolutions) { (userSolution: ExportedUserSolution) =>
          for {
            numbers <- evaluateSingleSolution(
              treeMatcher,
              goldNodeMatches = userSolution.nodeMatches.filter { _.matchStatus != MatchStatus.Deleted },
              sampleSolution,
              userSolution.userSolutionNodes
            )
          } yield userSolution.username -> numbers
        }
      } yield exerciseId -> result
    }
  }

}
