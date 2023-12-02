package model.matching.wordMatching

import model.levenshteinDistance
import model.matching._

final case class FuzzyWordMatchExplanation(
  distance: Int,
  maxLength: Int
) extends MatchExplanation:
  override lazy val certainty: Double = (maxLength - distance).toDouble / maxLength.toDouble

final case class WordWithRelatedWords(
  word: String,
  synonyms: Seq[String] = Seq.empty,
  antonyms: Seq[String] = Seq.empty
):
  def allRelatedWords: Seq[String] = synonyms ++ antonyms

type CertainWordMatch   = CertainMatch[WordWithRelatedWords]
type FuzzyWordMatch     = FuzzyMatch[WordWithRelatedWords, FuzzyWordMatchExplanation]
type WordMatchingResult = CompleteMatchingResult[WordWithRelatedWords, FuzzyWordMatchExplanation]

/** Matches words to words */
object WordMatcher extends FuzzyMatcher[WordWithRelatedWords, FuzzyWordMatchExplanation](MatchingParameters.fuzzyWordMatchingCertaintyThreshold):

  override protected def checkCertainMatch(left: WordWithRelatedWords, right: WordWithRelatedWords): Boolean = left.word == right.word

  override protected def generateFuzzyMatchExplanation(left: WordWithRelatedWords, right: WordWithRelatedWords): FuzzyWordMatchExplanation = {
    val allExplanations = for {
      leftWord  <- left.word.toLowerCase +: left.allRelatedWords.map(_.toLowerCase)
      rightWord <- right.word.toLowerCase +: right.allRelatedWords.map(_.toLowerCase)

      explanation = FuzzyWordMatchExplanation(levenshteinDistance(leftWord, rightWord), Math.max(leftWord.length, rightWord.length))
    } yield explanation

    allExplanations.maxBy(_.certainty)
  }
