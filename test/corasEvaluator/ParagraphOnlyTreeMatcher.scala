package corasEvaluator

import model.matching.Matcher
import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TreeMatcher}
import model.{SolutionNode, SolutionNodeMatch}
import model.matching.Match
import model.matching.paragraphMatching.ParagraphExtractor

object ParagraphOnlyNodeMatcher extends Matcher[SolutionNode, SolutionNodeMatchExplanation]:
  override protected def checkCertainMatch(left: SolutionNode, right: SolutionNode): Boolean = {
    val maybeLeftPar  = ParagraphExtractor.extract(left.text).flatMap(_.citedParagraphs).headOption
    val maybeRightPar = ParagraphExtractor.extract(right.text).flatMap(_.citedParagraphs).headOption

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
