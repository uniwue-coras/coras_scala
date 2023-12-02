package model.matching.nodeMatching

import model.matching.paragraphMatching.{ParagraphMatcher, ParagraphMatchingResult}
import model.matching.wordMatching.{WordMatcher, WordMatchingResult}
import model.matching.{CompleteMatchingResult, FuzzyMatcher, Match, MatchExplanation, MatchingParameters}

final case class SolutionNodeMatchExplanation(
  wordMatchingResult: WordMatchingResult,
  maybeParagraphMatchingResult: Option[ParagraphMatchingResult] = None
) extends MatchExplanation:

  private val paragraphMatchingProportion = MatchingParameters.paragraphMatchingCertaintyProportion

  override lazy val certainty: Double = maybeParagraphMatchingResult match
    case None => wordMatchingResult.certainty
    case Some(paragraphMatchingResult) =>
      paragraphMatchingProportion * paragraphMatchingResult.certainty + (1 - paragraphMatchingProportion) * wordMatchingResult.certainty

type FlatSolutionNodeMatch          = Match[FlatSolutionNodeWithData, SolutionNodeMatchExplanation]
type FlatSolutionNodeMatchingResult = CompleteMatchingResult[FlatSolutionNodeWithData, SolutionNodeMatchExplanation]

object FlatSolutionNodeMatcher
    extends FuzzyMatcher[FlatSolutionNodeWithData, SolutionNodeMatchExplanation](MatchingParameters.fuzzyNodeMatchingCertaintyThreshold):

  override protected def checkCertainMatch(left: FlatSolutionNodeWithData, right: FlatSolutionNodeWithData): Boolean =
    left.text.trim == right.text.trim

  override protected def generateFuzzyMatchExplanation(
    sampleNode: FlatSolutionNodeWithData,
    userNode: FlatSolutionNodeWithData
  ): SolutionNodeMatchExplanation = SolutionNodeMatchExplanation(
    WordMatcher.performMatching(sampleNode.wordsWithRelatedWords, userNode.wordsWithRelatedWords),
    ParagraphMatcher.generateResult(sampleNode.citedParagraphs, userNode.citedParagraphs)
  )
