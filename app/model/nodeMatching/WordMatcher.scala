package model.nodeMatching

import model.levenshtein.Levenshtein
import model.matching.{FuzzyMatcher, MatchExplanation, MatchingResult}

private[nodeMatching] final case class FuzzyWordMatchExplanation(distance: Int, maxLength: Int) extends MatchExplanation {

  override lazy val certainty: Double = (maxLength - distance).toDouble / maxLength.toDouble

}

final case class WordWithRelatedWords(
  word: String,
  synonyms: Seq[String] = Seq.empty,
  antonyms: Seq[String] = Seq.empty
) {

  def allRelatedWords: Seq[String] = synonyms ++ antonyms

}

// FIXME: multiple fuzzy steps: antonym, then Levenshtein

object WordMatcher extends FuzzyMatcher[WordWithRelatedWords, FuzzyWordMatchExplanation] {

  type WordMatchingResult = MatchingResult[WordWithRelatedWords, FuzzyWordMatchExplanation]

  override protected val certaintyThreshold = 0.5

  private def generateFuzzyMatchExplanation(left: String, right: String): FuzzyWordMatchExplanation = FuzzyWordMatchExplanation(
    Levenshtein.distance(left, right),
    Math.max(left.length, right.length)
  )

  override protected def checkCertainMatch(left: WordWithRelatedWords, right: WordWithRelatedWords): Boolean = left.word == right.word

  override protected def generateFuzzyMatchExplanation(left: WordWithRelatedWords, right: WordWithRelatedWords): FuzzyWordMatchExplanation = {
    val allExplanations = for {
      leftWord  <- left.word.toLowerCase +: left.allRelatedWords.map(_.toLowerCase)
      rightWord <- right.word.toLowerCase +: right.allRelatedWords.map(_.toLowerCase)
    } yield generateFuzzyMatchExplanation(leftWord, rightWord)

    allExplanations.maxBy(_.certainty)
  }

}