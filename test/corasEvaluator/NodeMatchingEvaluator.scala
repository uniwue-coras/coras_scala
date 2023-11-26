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

    Numbers(
      truePositiveCount = result.matches.length,
      falsePositiveTexts = result.notMatchedUser.map { case EvaluationNodeMatch(sampleNodeId, userNodeId, _, maybeExplanation) =>
        FalsePositiveDebugExplanation(
          sampleText = sampleNodes.find(_.id == sampleNodeId).get.text,
          userText = userNodes.find(_.id == userNodeId).get.text,
          maybeExplanation = maybeExplanation
        )
      },
      falseNegativeTexts = result.notMatchedSample.map { case ExportedSolutionNodeMatch(sampleNodeId, userNodeId, _, maybeCertainty) =>
        FalseNegativeDebugExplanation(
          sampleText = sampleNodes.find(_.id == sampleNodeId).get.text,
          userText = userNodes.find(_.id == userNodeId).get.text,
          maybeCertainty = maybeCertainty
        )
      }
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
