package model.matching.nodeMatching

import model.matching.paragraphMatching.ParagraphMatcher
import model.matching.wordMatching.WordMatcher
import model.matching.{FuzzyMatcher, Match, MatchingParameters, MatchingResult}

type FlatSolutionNodeMatch          = Match[FlatSolutionNodeWithData, SolutionNodeMatchExplanation]
type FlatSolutionNodeMatchingResult = MatchingResult[FlatSolutionNodeWithData, SolutionNodeMatchExplanation]

object FlatSolutionNodeMatcher
    extends FuzzyMatcher[FlatSolutionNodeWithData, SolutionNodeMatchExplanation](MatchingParameters.fuzzyNodeMatchingCertaintyThreshold):

  override protected def checkCertainMatch(left: FlatSolutionNodeWithData, right: FlatSolutionNodeWithData): Boolean =
    left.text.trim == right.text.trim

  override protected def generateFuzzyMatchExplanation(
    sampleNode: FlatSolutionNodeWithData,
    userNode: FlatSolutionNodeWithData
  ): SolutionNodeMatchExplanation = SolutionNodeMatchExplanation(
    wordMatchingResult = WordMatcher.performMatching(sampleNode.wordsWithRelatedWords, userNode.wordsWithRelatedWords),
    maybeParagraphMatchingResult =
      if sampleNode.citedParagraphs.isEmpty && userNode.citedParagraphs.isEmpty then None
      else Some(ParagraphMatcher.performMatching(sampleNode.citedParagraphs, userNode.citedParagraphs)),
    subTextMatchingResult =
      if sampleNode.subTextNodes.isEmpty && userNode.subTextNodes.isEmpty then None
      else Some(SubTextMatcher.performMatching(sampleNode.subTextNodes, userNode.subTextNodes))
  )
