package model.matching.nodeMatching

import model.matching.FuzzyMatcher
import model.matching.paragraphMatching.ParagraphMatcher
import model.matching.wordMatching.WordMatcher

class AnnotatedSolutionNodeMatcher(certaintyThreshold: Double) extends FuzzyMatcher[AnnotatedSolutionNode, SolutionNodeMatchExplanation](certaintyThreshold):

  override protected def checkCertainMatch(left: AnnotatedSolutionNode, right: AnnotatedSolutionNode): Boolean = left.text.trim == right.text.trim

  override def generateFuzzyMatchExplanation(
    sample: AnnotatedSolutionNode,
    user: AnnotatedSolutionNode
  ): SolutionNodeMatchExplanation = {
    // FIXME: match sub texts...
    SolutionNodeMatchExplanation(
      wordMatchingResult = WordMatcher.performMatching(sample.wordsWithRelatedWords, user.wordsWithRelatedWords),
      maybeParagraphMatchingResult = ParagraphMatcher.generateResult(sample.citedParagraphs, user.citedParagraphs)
    )
  }
