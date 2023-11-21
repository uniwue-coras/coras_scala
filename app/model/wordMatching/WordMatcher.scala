package model.wordMatching

import model.levenshtein.Levenshtein
import model.matching.{FuzzyMatcher, Match, MatchExplanation, MatchingResult}

final case class FuzzyWordMatchExplanation(distance: Int, maxLength: Int) extends MatchExplanation {
  override lazy val certainty: Double = (maxLength - distance).toDouble / maxLength.toDouble
}

final case class WordWithRelatedWords(
  word: String,
  synonyms: Seq[String] = Seq.empty,
  antonyms: Seq[String] = Seq.empty
) {
  def allRelatedWords: Seq[String] = synonyms ++ antonyms
}

/** Matches words to words */
object WordMatcher extends FuzzyMatcher[WordWithRelatedWords, FuzzyWordMatchExplanation] {

  type WordMatch          = Match[WordWithRelatedWords, FuzzyWordMatchExplanation]
  type WordMatchingResult = MatchingResult[WordWithRelatedWords, FuzzyWordMatchExplanation]

  override protected val certaintyThreshold = 0.5

  private def makeFuzzyMatchExplanation(left: String, right: String): FuzzyWordMatchExplanation = FuzzyWordMatchExplanation(
    Levenshtein.distance(left, right),
    Math.max(left.length, right.length)
  )

  override protected def checkCertainMatch(left: WordWithRelatedWords, right: WordWithRelatedWords): Boolean = left.word == right.word

  override protected def generateFuzzyMatchExplanation(left: WordWithRelatedWords, right: WordWithRelatedWords): FuzzyWordMatchExplanation = {
    val allExplanations = for {
      leftWord  <- left.word.toLowerCase +: left.allRelatedWords.map(_.toLowerCase)
      rightWord <- right.word.toLowerCase +: right.allRelatedWords.map(_.toLowerCase)
    } yield makeFuzzyMatchExplanation(leftWord, rightWord)

    allExplanations.maxBy(_.certainty)
  }

}
