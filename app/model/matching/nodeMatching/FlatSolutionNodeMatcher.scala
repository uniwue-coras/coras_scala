package model.matching.nodeMatching

import model.matching.paragraphMatching.ParagraphMatcher
import model.matching.wordMatching.WordMatcher
import model.matching.{FuzzyMatcher, Match, MatchingParameters, MatchingResult}

type FlatSolutionNodeMatch          = Match[AnnotatedSolutionNode, SolutionNodeMatchExplanation]
type FlatSolutionNodeMatchingResult = MatchingResult[AnnotatedSolutionNode, SolutionNodeMatchExplanation]

object FlatSolutionNodeMatcher
    extends FuzzyMatcher[AnnotatedSolutionNode, SolutionNodeMatchExplanation](MatchingParameters.fuzzyNodeMatchingCertaintyThreshold):

  override protected def checkCertainMatch(left: AnnotatedSolutionNode, right: AnnotatedSolutionNode): Boolean =
    left.text.trim == right.text.trim

  override protected def generateFuzzyMatchExplanation(
    sampleNode: AnnotatedSolutionNode,
    userNode: AnnotatedSolutionNode
  ): SolutionNodeMatchExplanation = SolutionNodeMatchExplanation(
    wordMatchingResult = WordMatcher.performMatching(sampleNode.wordsWithRelatedWords, userNode.wordsWithRelatedWords),
    maybeParagraphMatchingResult =
      if sampleNode.citedParagraphs.isEmpty && userNode.citedParagraphs.isEmpty then None
      else Some(ParagraphMatcher.performMatching(sampleNode.citedParagraphs, userNode.citedParagraphs)),
    subTextMatchingResult =
      if sampleNode.subTextNodes.isEmpty && userNode.subTextNodes.isEmpty then None
      else Some(SubTextMatcher.performMatching(sampleNode.subTextNodes, userNode.subTextNodes))
  )
