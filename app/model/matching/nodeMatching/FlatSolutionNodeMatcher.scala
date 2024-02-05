package model.matching.nodeMatching

import model.matching.paragraphMatching.ParagraphMatcher
import model.matching.wordMatching.WordMatcher
import model.matching.{FuzzyMatcher, Match, MatchingResult}

type FlatSolutionNodeMatch          = Match[FlatSolutionNodeWithData, SolutionNodeMatchExplanation]
type FlatSolutionNodeMatchingResult = MatchingResult[FlatSolutionNodeWithData, SolutionNodeMatchExplanation]

object FlatSolutionNodeMatcher extends FuzzyMatcher[FlatSolutionNodeWithData, SolutionNodeMatchExplanation](certaintyThreshold = 0.4):

  override protected def checkCertainMatch(left: FlatSolutionNodeWithData, right: FlatSolutionNodeWithData): Boolean =
    left.text.trim == right.text.trim

  override protected def generateFuzzyMatchExplanation(
    sampleNode: FlatSolutionNodeWithData,
    userNode: FlatSolutionNodeWithData
  ): SolutionNodeMatchExplanation = SolutionNodeMatchExplanation(
    wordMatchingResult = WordMatcher.performMatching(sampleNode.wordsWithRelatedWords, userNode.wordsWithRelatedWords),
    maybeParagraphMatchingResult = ParagraphMatcher.generateResult(sampleNode.citedParagraphs, userNode.citedParagraphs)
  )
