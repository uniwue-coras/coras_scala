package model.matching.paragraphMatching

import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TreeMatcher}
import model.matching.{Match, Matcher, WordAnnotator}
import model.{DefaultSolutionNodeMatch, SolutionNode}

object ParagraphOnlyNodeMatcher extends Matcher[SolutionNode, SolutionNodeMatchExplanation]:
  override protected def checkCertainMatch(left: SolutionNode, right: SolutionNode): Boolean = {
    val maybeLeftPar  = left.paragraphCitationLocations.flatMap(_.citedParagraphs).headOption
    val maybeRightPar = right.paragraphCitationLocations.flatMap(_.citedParagraphs).headOption

    (maybeLeftPar, maybeRightPar) match {
      case (Some(leftPar), Some(rightPar)) => leftPar == rightPar
      case _                               => false
    }
  }

@deprecated()
object ParagraphOnlyTreeMatcher extends TreeMatcher(WordAnnotator(Map.empty, Seq.empty)):

  override def performMatching(
    sampleSolution: Seq[SolutionNode],
    userSolution: Seq[SolutionNode]
  ): Seq[DefaultSolutionNodeMatch] = ParagraphOnlyNodeMatcher
    .performMatching(sampleSolution, userSolution)
    .matches
    .map { case Match(sampleValue, userValue, explanation) => DefaultSolutionNodeMatch(sampleValue.id, userValue.id, explanation) }
