package model.matching.paragraphMatching

import model.DefaultSolutionNodeMatch
import model.matching.nodeMatching.{BasicTreeMatcher, SolutionNodeContainer, SolutionNodeMatchExplanation}
import model.matching.{Match, Matcher}

object ParagraphOnlyNodeMatcher extends Matcher[SolutionNodeContainer, SolutionNodeMatchExplanation]:
  override protected def checkCertainMatch(left: SolutionNodeContainer, right: SolutionNodeContainer): Boolean = {
    val maybeLeftPar  = left.node.citedParagraphs.headOption
    val maybeRightPar = right.node.citedParagraphs.headOption

    (maybeLeftPar, maybeRightPar) match {
      case (Some(leftPar), Some(rightPar)) =>
        // FIXME: don't use rest!

        val parTypeEqual  = leftPar.paragraphType == rightPar.paragraphType
        val lawCodeEqual  = leftPar.lawCode == rightPar.lawCode
        val parNumEqual   = leftPar.paragraphNumber == rightPar.paragraphNumber
        val sectionEquals = leftPar.section == rightPar.section

        parTypeEqual && lawCodeEqual && parNumEqual && sectionEquals

      case _ => false
    }
  }

object ParagraphOnlyTreeMatcher extends BasicTreeMatcher:
  override def performMatching(
    sampleSolution: Seq[SolutionNodeContainer],
    userSolution: Seq[SolutionNodeContainer]
  ): Seq[DefaultSolutionNodeMatch] = ParagraphOnlyNodeMatcher
    .performMatching(sampleSolution, userSolution)
    .matches
    .map { case Match(sampleValue, userValue, explanation) => DefaultSolutionNodeMatch(sampleValue.node, userValue.node, explanation) }
