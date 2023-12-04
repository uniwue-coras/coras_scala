package corasEvaluator

import model.exporting.{ExportedFlatSampleSolutionNode, ExportedFlatUserSolutionNode, ExportedSolutionNodeMatch, ExportedUserSolution}
import model.matching.CertainMatchingResult
import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TreeMatcher}
import model.{MatchStatus, SolutionNode, SolutionNodeMatch}

import scala.concurrent.{ExecutionContext, Future}

type ExerciseToEvaluate = (Int, Seq[ExportedFlatSampleSolutionNode], Seq[ExportedUserSolution])

object NodeMatchingEvaluator:

  def evaluateFoundMatches(
    goldMatches: Seq[ExportedSolutionNodeMatch],
    foundMatches: Seq[SolutionNodeMatch],
    sampleNodes: Seq[SolutionNode],
    userNodes: Seq[SolutionNode]
  ): EvalResults = {
    // evaluate current matching
    val CertainMatchingResult(
      correctNodeMatches,
      notMatchedSampleMatches,
      notMatchedUserMatches
    ) = NodeMatchMatcher.performCertainMatching(goldMatches, foundMatches)

    // TODO: evaluate falseNeg + falsePos

    val (certainFalseNegativeTexts, fuzzyFalseNegativeTexts) = notMatchedSampleMatches.partitionMap {
      case ExportedSolutionNodeMatch(sampleNodeId, userNodeId, _, maybeCertainty) =>
        val sampleText = sampleNodes.find(_.id == sampleNodeId).get.text
        val userText   = userNodes.find(_.id == userNodeId).get.text

        maybeCertainty match
          case None            => Left(CertainDebugExplanation(sampleNodeId, sampleText, userNodeId, userText))
          case Some(certainty) => Right(FuzzyFalseNegativeDebugExplanation(sampleNodeId, sampleText, userNodeId, userText, certainty))
    }

    val (certainFalsePositiveTexts, fuzzyFalsePositiveTexts) = notMatchedUserMatches.partitionMap {
      case EvaluationNodeMatch(sampleNodeId, userNodeId, maybeExplanation) =>
        val sampleText = sampleNodes.find(_.id == sampleNodeId).get.text
        val userText   = userNodes.find(_.id == userNodeId).get.text

        maybeExplanation match
          case None              => Left(CertainDebugExplanation(sampleNodeId, sampleText, userNodeId, userText))
          case Some(explanation) => Right(FuzzyFalsePositiveDebugExplanation(sampleNodeId, sampleText, userNodeId, userText, explanation))
    }

    EvalResults(
      truePositiveCount = correctNodeMatches.length,
      // foundMatching = foundMatches,
      certainFalsePositiveTexts = certainFalsePositiveTexts,
      fuzzyFalsePositiveTexts = fuzzyFalsePositiveTexts,
      certainFalseNegativeTexts = certainFalseNegativeTexts,
      fuzzyFalseNegativeTexts = fuzzyFalseNegativeTexts
    )
  }

  def evaluateNodeMatching(
    treeMatcher: TreeMatcher[SolutionNodeMatch],
    exercises: Seq[ExerciseToEvaluate]
  )(implicit ec: ExecutionContext): Future[Seq[(Int, Map[String, EvalResults])]] = Future.traverse(exercises) { (exerciseId, sampleSolution, userSolutions) =>
    for {
      result <- Future.traverse(userSolutions) { (userSolution: ExportedUserSolution) =>
        for {
          foundMatches <- Future { treeMatcher.performMatching(sampleSolution, userSolution.userSolutionNodes) }
          numbers <- Future {
            evaluateFoundMatches(
              goldMatches = userSolution.nodeMatches.filter { _.matchStatus != MatchStatus.Deleted },
              foundMatches,
              sampleSolution,
              userSolution.userSolutionNodes
            )
          }
        } yield userSolution.username -> numbers
      }

    } yield exerciseId -> result.toMap
  }
