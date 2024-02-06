package model.matching.nodeMatching

import model.matching.FuzzyMatcher
import model.matching.paragraphMatching.ParagraphMatcher
import model.matching.wordMatching.WordMatcher

object AnnotatedSolutionNodeMatcher extends FuzzyMatcher[AnnotatedSolutionNode, SolutionNodeMatchExplanation](certaintyThreshold = 0.8):

  override protected def checkCertainMatch(left: AnnotatedSolutionNode, right: AnnotatedSolutionNode): Boolean =
    left.text.trim == right.text.trim

  override protected def generateFuzzyMatchExplanation(
    sampleNode: AnnotatedSolutionNode,
    userNode: AnnotatedSolutionNode
  ): SolutionNodeMatchExplanation = SolutionNodeMatchExplanation(
    wordMatchingResult = WordMatcher.performMatching(sampleNode.wordsWithRelatedWords, userNode.wordsWithRelatedWords),
    maybeParagraphMatchingResult = ParagraphMatcher.generateResult(sampleNode.citedParagraphs, userNode.citedParagraphs)
  )
