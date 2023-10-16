package de.uniwue.ls6.matching

import de.uniwue.ls6.matching.WordMatcher.WordMatchingResult

object FlatSolutionNodeMatcher extends Matcher[BaseFlatSolutionNode, WordMatchingResult] {

  override protected val certaintyThreshold = 0.2

  override protected def checkCertainMatch(left: BaseFlatSolutionNode, right: BaseFlatSolutionNode): Boolean = left.text.trim == right.text.trim

  override protected def generateFuzzyMatchExplanation(l: BaseFlatSolutionNode, r: BaseFlatSolutionNode): WordMatchingResult =
    WordMatcher.performMatching(l.wordsWithRelatedWords, r.wordsWithRelatedWords)

  override protected def fuzzyMatchingRate(explanation: WordMatchingResult): Double = explanation.rate

}
