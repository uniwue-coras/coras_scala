package model.nodeMatching

import model.matching.FuzzyMatcher

object FlatSolutionNodeMatcher extends FuzzyMatcher[FlatSolutionNodeWithData, WordMatcher.WordMatchingResult] {

  override protected val certaintyThreshold = 0.2

  override protected def checkCertainMatch(left: FlatSolutionNodeWithData, right: FlatSolutionNodeWithData): Boolean =
    left.text.trim == right.text.trim

  override protected def generateFuzzyMatchExplanation(l: FlatSolutionNodeWithData, r: FlatSolutionNodeWithData): WordMatcher.WordMatchingResult = {
    // FIXME: use cited paragraphss!

    val leftParagraphs  = l.citedParagraphs
    val rightParagraphs = r.citedParagraphs

    if (leftParagraphs.nonEmpty || rightParagraphs.nonEmpty) {
      // TODO: compare paragraphs...

    }

    model.nodeMatching.WordMatcher.performMatching(l.wordsWithRelatedWords, r.wordsWithRelatedWords)
  }

}
