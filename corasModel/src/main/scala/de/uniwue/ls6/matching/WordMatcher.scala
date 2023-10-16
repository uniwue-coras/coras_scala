package de.uniwue.ls6.matching

import de.uniwue.ls6.levenshtein.Levenshtein
import de.uniwue.ls6.model.RelatedWord

private[matching] final case class FuzzyWordMatchExplanation(distance: Int, maxLength: Int) {
  lazy val rate: Double = (maxLength - distance).toDouble / maxLength.toDouble
}

final case class WordWithRelatedWords(word: String, synonyms: Seq[RelatedWord] = Seq.empty)

// FIXME: multiple fuzzy steps: antonym, then Levenshtein

object WordMatcher extends Matcher[WordWithRelatedWords, FuzzyWordMatchExplanation] {

  type WordMatchingResult = MatchingResult[WordWithRelatedWords, FuzzyWordMatchExplanation]

  override protected val certaintyThreshold = 0.5

  private def generateFuzzyMatchExplanation(left: String, right: String): FuzzyWordMatchExplanation = FuzzyWordMatchExplanation(
    Levenshtein.distance(left, right),
    Math.max(left.length, right.length)
  )

  override protected def checkCertainMatch(left: WordWithRelatedWords, right: WordWithRelatedWords): Boolean = left.word == right.word

  override protected def fuzzyMatchingRate(explanation: FuzzyWordMatchExplanation): Double = explanation.rate

  override protected def generateFuzzyMatchExplanation(left: WordWithRelatedWords, right: WordWithRelatedWords): FuzzyWordMatchExplanation = {
    val allExplanations = for {
      leftWord  <- left.word.toLowerCase +: left.synonyms.map(_.word.toLowerCase)
      rightWord <- right.word.toLowerCase +: right.synonyms.map(_.word.toLowerCase)
    } yield generateFuzzyMatchExplanation(leftWord, rightWord)

    allExplanations.maxBy(_.rate)
  }

}
