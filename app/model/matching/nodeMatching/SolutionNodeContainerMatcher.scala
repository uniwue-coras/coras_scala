package model.matching.nodeMatching

import model.matching.paragraphMatching.{ParagraphCitation, ParagraphMatcher}
import model.matching.wordMatching.WordMatcher
import model.matching.{FuzzyMatcher, MatchingParameters}

object SolutionNodeContainerMatcher
    extends FuzzyMatcher[SolutionNodeContainer, SolutionNodeMatchExplanation](MatchingParameters.fuzzySolutionNodeContainerMatchingCertaintyThreshold):

  override protected def checkCertainMatch(left: SolutionNodeContainer, right: SolutionNodeContainer): Boolean =
    left.node.text.trim == right.node.text.trim

  private def matchParagraph(sampleParagraphs: Seq[ParagraphCitation], userParagraphs: Seq[ParagraphCitation]) =
    if (sampleParagraphs.nonEmpty || userParagraphs.nonEmpty) {
      Some(ParagraphMatcher.performMatching(sampleParagraphs, userParagraphs))
    } else None

  override protected def generateFuzzyMatchExplanation(
    sample: SolutionNodeContainer,
    user: SolutionNodeContainer
  ): SolutionNodeMatchExplanation = SolutionNodeMatchExplanation(
    WordMatcher.performMatching(sample.node.wordsWithRelatedWords, user.node.wordsWithRelatedWords),
    matchParagraph(sample.node.citedParagraphs.flatMap(_.citedParagraphs), user.node.citedParagraphs.flatMap(_.citedParagraphs))
  )
