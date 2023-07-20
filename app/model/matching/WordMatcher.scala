package model.matching

import model.levenshtein.Levenshtein

private[matching] final case class FuzzyWordMatchExplanation(distance: Int, maxLength: Int) {
  lazy val rate: Double = (maxLength - distance).toDouble / maxLength.toDouble
}

// FIXME: multiple fuzzy steps: antonym, then Levenshtein

// noinspection TypeAnnotation
private[matching] object WordMatcher extends Matcher[WordWithSynonymsAntonyms, FuzzyWordMatchExplanation] {

  type WordMatchingResult = MatchingResult[WordWithSynonymsAntonyms, FuzzyWordMatchExplanation]

  override protected val fuzzyMatchingRate  = _.rate
  override protected val certaintyThreshold = 0.5
  override protected val checkCertainMatch  = _.word == _.word

  private def generateFuzzyMatchExplanation(left: String, right: String): FuzzyWordMatchExplanation = FuzzyWordMatchExplanation(
    Levenshtein.distance(left, right),
    Math.max(left.length, right.length)
  )

  override protected val generateFuzzyMatchExplanation = { case (left, right) =>
    val allExplanations = for {
      leftWord  <- left.word.toLowerCase +: left.synonyms.map(_.word.toLowerCase)
      rightWord <- right.word.toLowerCase +: right.synonyms.map(_.word.toLowerCase)
    } yield generateFuzzyMatchExplanation(leftWord, rightWord)

    allExplanations.maxBy(_.rate)
  }

}
