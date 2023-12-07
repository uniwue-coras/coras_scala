package corasEvaluator

import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TreeMatcher}
import model.matching.{Match, Matcher}
import model.{SolutionNode, SolutionNodeMatch}

object ParagraphOnlyNodeMatcher extends Matcher[SolutionNode, SolutionNodeMatchExplanation]:
  override protected def checkCertainMatch(left: SolutionNode, right: SolutionNode): Boolean = {
    val maybeLeftPar  = left.paragraphCitationLocations.flatMap(_.citedParagraphs).headOption
    val maybeRightPar = right.paragraphCitationLocations.flatMap(_.citedParagraphs).headOption

    (maybeLeftPar, maybeRightPar) match {
      case (Some(leftPar), Some(rightPar)) => leftPar == rightPar
      case _                               => false
    }
  }

object ParagraphOnlyTreeMatcher extends TreeMatcher[SolutionNodeMatch](Map.empty, Seq.empty):

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    maybeExplanation: Option[SolutionNodeMatchExplanation]
  ): SolutionNodeMatch = ???

  override def performMatching(
    sampleSolution: Seq[SolutionNode],
    userSolution: Seq[SolutionNode]
  ): Seq[SolutionNodeMatch] = ParagraphOnlyNodeMatcher
    .performMatching(sampleSolution, userSolution)
    .matches
    .map { case Match(sampleValue, userValue, explanation) => EvaluationNodeMatch(sampleValue.id, userValue.id, explanation) }
