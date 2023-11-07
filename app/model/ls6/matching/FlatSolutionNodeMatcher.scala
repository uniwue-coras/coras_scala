package model.ls6.matching

import model.ls6.matching.WordMatcher.WordMatchingResult

object FlatSolutionNodeMatcher extends Matcher[FlatSolutionNodeWithData, WordMatchingResult] {

  override protected val certaintyThreshold = 0.2

  override protected def checkCertainMatch(left: FlatSolutionNodeWithData, right: FlatSolutionNodeWithData): Boolean =
    left.text.trim == right.text.trim

  override protected def generateFuzzyMatchExplanation(l: FlatSolutionNodeWithData, r: FlatSolutionNodeWithData): WordMatchingResult = {
    // FIXME: use cited paragraphss!

    val leftParagraphs  = l.citedParagraphs
    val rightParagraphs = r.citedParagraphs

    WordMatcher.performMatching(l.wordsWithRelatedWords, r.wordsWithRelatedWords)
  }

  override protected def fuzzyMatchingRate(explanation: WordMatchingResult): Double = explanation.rate

}
