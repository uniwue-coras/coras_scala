package model.matching

import model.matching.WordMatcher.WordMatchingResult

final case class ParagraphCitationMatchExplanation()

object ParagraphCitationMatcher extends FuzzyMatcher[ParagraphCitation, ParagraphCitationMatchExplanation] {

  override protected val certaintyThreshold: Double = ???

  override protected def checkCertainMatch(left: ParagraphCitation, right: ParagraphCitation): Boolean = {
    val lawCodeEqual = left.lawCode == right.lawCode

    lawCodeEqual && false
  }

  override protected def generateFuzzyMatchExplanation(left: ParagraphCitation, right: ParagraphCitation): ParagraphCitationMatchExplanation = ???

  override protected def fuzzyMatchingRate(explanation: ParagraphCitationMatchExplanation): Double = ???

}

object FlatSolutionNodeMatcher extends FuzzyMatcher[FlatSolutionNodeWithData, WordMatchingResult] {

  override protected val certaintyThreshold = 0.2

  override protected def checkCertainMatch(left: FlatSolutionNodeWithData, right: FlatSolutionNodeWithData): Boolean =
    left.text.trim == right.text.trim

  override protected def generateFuzzyMatchExplanation(l: FlatSolutionNodeWithData, r: FlatSolutionNodeWithData): WordMatchingResult = {
    // FIXME: use cited paragraphss!

    val leftParagraphs  = l.citedParagraphs
    val rightParagraphs = r.citedParagraphs

    if (leftParagraphs.nonEmpty || rightParagraphs.nonEmpty) {
      // TODO: compare paragraphs...

    }

    WordMatcher.performMatching(l.wordsWithRelatedWords, r.wordsWithRelatedWords)
  }

  override protected def fuzzyMatchingRate(explanation: WordMatchingResult): Double = explanation.rate

}
