package model.matching.paragraphMatching

import model.matching.nodeMatching.{AnnotatedSolutionNode, BasicTreeMatcher, SolutionNodeMatchExplanation}
import model.matching.{Match, Matcher}
import model.{DefaultSolutionNodeMatch, SolutionTree}

object ParagraphOnlyNodeMatcher extends Matcher[AnnotatedSolutionNode, SolutionNodeMatchExplanation]:
  override protected def checkCertainMatch(left: AnnotatedSolutionNode, right: AnnotatedSolutionNode): Boolean = {
    val maybeLeftPar  = left.citedParagraphs.headOption
    val maybeRightPar = right.citedParagraphs.headOption

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
    sampleSolution: SolutionTree,
    userSolution: SolutionTree
  ): Seq[DefaultSolutionNodeMatch] = ParagraphOnlyNodeMatcher
    .performMatching(sampleSolution.nodes, userSolution.nodes)
    .matches
    .map { case Match(sampleValue, userValue, explanation) => DefaultSolutionNodeMatch(sampleValue, userValue, explanation) }
