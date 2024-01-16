package model.matching.nodeMatching

import model.matching.paragraphMatching.ParagraphMatcher
import model.matching.wordMatching.WordMatcher
import model.matching.{FuzzyMatcher, MatchingParameters}

object SolutionNodeContainerMatcher
    extends FuzzyMatcher[SolutionNodeContainer, SolutionNodeMatchExplanation](MatchingParameters.fuzzySolutionNodeContainerMatchingCertaintyThreshold):

  override protected def checkCertainMatch(left: SolutionNodeContainer, right: SolutionNodeContainer): Boolean =
    left.text.trim == right.text.trim

    // FIXME: use subTextNodes!
  override protected def generateFuzzyMatchExplanation(
    sample: SolutionNodeContainer,
    user: SolutionNodeContainer
  ): SolutionNodeMatchExplanation = SolutionNodeMatchExplanation(
    wordMatchingResult = WordMatcher.performMatching(sample.wordsWithRelatedWords, user.wordsWithRelatedWords),
    maybeParagraphMatchingResult =
      if sample.node.citedParagraphs.isEmpty && user.node.citedParagraphs.isEmpty then None
      else Some(ParagraphMatcher.performMatching(sample.node.citedParagraphs, user.node.citedParagraphs)),
    subTextMatchingResult =
      if sample.subTextNodes.isEmpty && user.subTextNodes.isEmpty then None
      else Some(SubTextMatcher.performMatching(sample.subTextNodes, user.subTextNodes))
  )
