package corasEvaluator

import model.exporting.ExportedSolutionNodeMatch
import model.matching.CertainMatchingResult
import model.{SolutionNode, SolutionNodeMatch}
import org.apache.pekko.actor.typed.scaladsl.Behaviors
import org.apache.pekko.actor.typed.{ActorRef, Behavior}

final case class EvaluateFoundMatchesMessage(
  goldMatches: Seq[ExportedSolutionNodeMatch],
  foundMatches: Seq[SolutionNodeMatch],
  sampleNodes: Seq[SolutionNode],
  userNodes: Seq[SolutionNode],
  replyTo: ActorRef[EvalResults]
)

object FoundMatchesEvaluationActor:
  def apply: Behavior[EvaluateFoundMatchesMessage] = Behaviors.receiveMessage {
    case EvaluateFoundMatchesMessage(goldMatches, foundMatches, sampleNodes, userNodes, replyTo) =>
      // evaluate current matching
      val CertainMatchingResult(
        correctNodeMatches,
        notMatchedSampleMatches,
        notMatchedUserMatches
      ) = NodeMatchMatcher.performCertainMatching(goldMatches, foundMatches)

      // evaluate falseNeg + falsePos

      val truePositiveCount = correctNodeMatches.length

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

      replyTo ! EvalResults(truePositiveCount, certainFalsePositiveTexts, fuzzyFalsePositiveTexts, certainFalseNegativeTexts, fuzzyFalseNegativeTexts)

      Behaviors.same
  }
