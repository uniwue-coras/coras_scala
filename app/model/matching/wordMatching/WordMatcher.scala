package model.matching.wordMatching

import model.graphql.GraphQLContext
import model.levenshteinDistance
import model.matching.{FuzzyMatcher, Match, MatchingResult}
import sangria.schema.ObjectType

type WordMatch          = Match[WordWithRelatedWords, FuzzyWordMatchExplanation]
type WordMatchingResult = MatchingResult[WordWithRelatedWords, FuzzyWordMatchExplanation]

/** Matches words to words */
object WordMatcher extends FuzzyMatcher[WordWithRelatedWords, FuzzyWordMatchExplanation]:

  override protected val defaultCertaintyThreshold: Double = 0.5

  override protected def checkCertainMatch(left: WordWithRelatedWords, right: WordWithRelatedWords): Boolean = left.word == right.word

  override def generateFuzzyMatchExplanation(left: WordWithRelatedWords, right: WordWithRelatedWords): FuzzyWordMatchExplanation = {
    val allExplanations = for {
      leftWord  <- left.allWords.map(_.toLowerCase)
      rightWord <- right.allWords.map(_.toLowerCase)
    } yield FuzzyWordMatchExplanation(levenshteinDistance(leftWord, rightWord), Math.max(leftWord.length, rightWord.length))

    allExplanations.maxBy(_.certainty)
  }

  val wordMatchingQueryType: ObjectType[GraphQLContext, WordMatchingResult] =
    MatchingResult.queryType("Word", WordWithRelatedWords.queryType, FuzzyWordMatchExplanation.queryType)
