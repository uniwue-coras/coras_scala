package corasEvaluator

import model.SolutionNode
import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TreeMatcher}
import model.matching.{CertainMatch, CertainMatcher}

object ParagraphOnlyNodeMatcher extends CertainMatcher[SolutionNode]:
  override protected def checkCertainMatch(left: SolutionNode, right: SolutionNode): Boolean = {
    val leftParagraphs  = left.paragraphCitationLocations.flatMap(_.citedParagraphs)
    val rightParagraphs = right.paragraphCitationLocations.flatMap(_.citedParagraphs)

    // Try only first paragraph for now...
    (leftParagraphs.headOption, rightParagraphs.headOption) match
      case (None, _)                           => false
      case (_, None)                           => false
      case (Some(leftFirst), Some(rightFirst)) => leftFirst == rightFirst

  }

object ParagraphOnlyTreeMatcher extends TreeMatcher[EvaluationNodeMatch](Map.empty, Seq.empty):

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    maybeExplanation: Option[SolutionNodeMatchExplanation]
  ): EvaluationNodeMatch = ???

  override def performMatching(sampleSolution: Seq[SolutionNode], userSolution: Seq[SolutionNode]): Seq[EvaluationNodeMatch] =
    ParagraphOnlyNodeMatcher
      .performCertainMatching(sampleSolution, userSolution)
      .matches
      .map { case CertainMatch(sampleNode, userNode) => EvaluationNodeMatch(sampleNode.id, userNode.id, None) }
