package model.matching

import de.uniwue.ls6.levenshtein.Levenshtein
import de.uniwue.ls6.matching.{Matcher, MatchingResult}

private[matching] final case class FuzzyWordMatchExplanation(distance: Int, maxLength: Int) {
  lazy val rate: Double = (maxLength - distance).toDouble / maxLength.toDouble
}

// FIXME: multiple fuzzy steps: antonym, then Levenshtein

private[matching] object WordMatcher extends Matcher[WordWithSynonymsAntonyms, FuzzyWordMatchExplanation] {

  type WordMatchingResult = MatchingResult[WordWithSynonymsAntonyms, FuzzyWordMatchExplanation]

  override protected val fuzzyMatchingRate: FuzzyWordMatchExplanation => Double                             = _.rate
  override protected val certaintyThreshold                                                                 = 0.5
  override protected val checkCertainMatch: (WordWithSynonymsAntonyms, WordWithSynonymsAntonyms) => Boolean = _.word == _.word

  private def generateFuzzyMatchExplanation(left: String, right: String): FuzzyWordMatchExplanation = FuzzyWordMatchExplanation(
    Levenshtein.distance(left, right),
    Math.max(left.length, right.length)
  )

  override protected val generateFuzzyMatchExplanation: (WordWithSynonymsAntonyms, WordWithSynonymsAntonyms) => FuzzyWordMatchExplanation = {
    case (left, right) =>
      val allExplanations = for {
        leftWord  <- left.word.toLowerCase +: left.synonyms.map(_.word.toLowerCase)
        rightWord <- right.word.toLowerCase +: right.synonyms.map(_.word.toLowerCase)
      } yield generateFuzzyMatchExplanation(leftWord, rightWord)

      allExplanations.maxBy(_.rate)
  }

}
