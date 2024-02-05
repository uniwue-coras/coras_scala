package model.matching.nodeMatching

import model.matching.paragraphMatching.ParagraphMatcher
import model.matching.wordMatching.WordMatcher
import model.matching.FuzzyMatcher

object SolutionNodeContainerMatcher extends FuzzyMatcher[SolutionNodeContainer, SolutionNodeMatchExplanation](certaintyThreshold = 0.2):

  override protected def checkCertainMatch(left: SolutionNodeContainer, right: SolutionNodeContainer): Boolean =
    left.node.text.trim == right.node.text.trim

  override protected def generateFuzzyMatchExplanation(
    sample: SolutionNodeContainer,
    user: SolutionNodeContainer
  ): SolutionNodeMatchExplanation = SolutionNodeMatchExplanation(
    WordMatcher.performMatching(sample.node.wordsWithRelatedWords, user.node.wordsWithRelatedWords),
    ParagraphMatcher.generateResult(sample.node.citedParagraphs, user.node.citedParagraphs)
  )
