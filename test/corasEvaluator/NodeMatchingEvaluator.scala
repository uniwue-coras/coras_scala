package corasEvaluator

import model.exporting.{ExportedExercise, ExportedFlatSampleSolutionNode, ExportedFlatUserSolutionNode, ExportedSolutionNodeMatch}
import model.{ExportedRelatedWord, MatchStatus}

import scala.concurrent.{ExecutionContext, Future}

class NodeMatchingEvaluator(
  abbreviations: Map[String, String],
  relatedWordGroups: Seq[Seq[ExportedRelatedWord]]
) {

  private def evaluateSingleSolution(
    treeMatcher: EvaluatorTreeMatcher,
    goldNodeMatches: Seq[ExportedSolutionNodeMatch],
    sampleNodes: Seq[ExportedFlatSampleSolutionNode],
    userNodes: Seq[ExportedFlatUserSolutionNode]
  )(implicit ec: ExecutionContext): Future[Numbers] = Future {

    // perform current matching
    val foundNodeMatches = treeMatcher.performMatching(sampleNodes, userNodes)

    // evaluate current matching
    val result = NodeMatchMatcher.performMatching(goldNodeMatches, foundNodeMatches)

    // TODO: evaluate falseNeg + falsePos

    val falseNegativeMatches = result.notMatchedSample
    val falsePositiveMatches = result.notMatchedUser

    val falsePositiveTexts = falsePositiveMatches.map { case ExportedSolutionNodeMatch(sampleNodeId, userNodeId, _, maybeExplanation) =>
      TextsForComparison(
        sample = sampleNodes.find(_.id == sampleNodeId).get.text,
        user = userNodes.find(_.id == userNodeId).get.text,
        certainty = maybeExplanation.getOrElse(1.0)
      )
    }

    Numbers(
      truePositiveCount = result.matches.length,
      falseNegativeCount = falseNegativeMatches.length,
      falsePositiveCount = falsePositiveMatches.length,
      falsePositiveTexts = falsePositiveTexts
    )
  }

  def evaluateNodeMatching(exercises: Seq[ExportedExercise])(implicit ec: ExecutionContext): Future[Seq[Numbers]] = {

    val exesAndSols = for {
      exercise <- exercises
      userSol  <- exercise.userSolutions
    } yield (exercise, userSol)

    Future.traverse(exesAndSols) { case (ex, sol) =>
      // remove deleted matches
      val goldNodeMatches = sol.nodeMatches.filter { _.matchStatus != MatchStatus.Deleted }

      val treeMatcher = new EvaluatorTreeMatcher(abbreviations, relatedWordGroups)

      evaluateSingleSolution(
        treeMatcher,
        goldNodeMatches = goldNodeMatches,
        sampleNodes = ex.sampleSolutionNodes,
        userNodes = sol.userSolutionNodes
      )
    }
  }

}
