package model.matching.nodeMatching

import model.matching.wordMatching.{WordMatcher, WordMatchingResult}
import model.matching.{FuzzyMatcher, MatchExplanation, MatchingParameters, MatchingResult}

final case class SubTextMatchExplanation(
  sampleNodeId: Int,
  sampleIndex: Int,
  userNodeId: Int,
  userIndex: Int,
  wordMatchingResult: WordMatchingResult
) extends MatchExplanation:
  override def certainty: Double = wordMatchingResult.certainty

type SubTextMatchingResult = MatchingResult[AnnotatedSubTextNode, SubTextMatchExplanation]

object SubTextMatcher extends FuzzyMatcher[AnnotatedSubTextNode, SubTextMatchExplanation](MatchingParameters.fuzzySubTextMatchingThreshold):

  override protected def checkCertainMatch(left: AnnotatedSubTextNode, right: AnnotatedSubTextNode): Boolean = left.text == right.text

  override protected def generateFuzzyMatchExplanation(sample: AnnotatedSubTextNode, user: AnnotatedSubTextNode): SubTextMatchExplanation =
    SubTextMatchExplanation(
      sample.nodeId,
      sample.id,
      user.nodeId,
      user.id,
      WordMatcher.performMatching(sample.wordsWithRelatedWords, user.wordsWithRelatedWords)
    )
