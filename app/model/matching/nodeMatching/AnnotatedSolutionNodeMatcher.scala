package model.matching.nodeMatching

import model.matching.FuzzyMatcher
import model.matching.paragraphMatching.ParagraphMatcher
import model.matching.wordMatching.WordMatcher

object AnnotatedSolutionNodeMatcher extends FuzzyMatcher[AnnotatedSolutionNode, SolutionNodeMatchExplanation]:
  // FIXME: use child similarity!

  override protected val defaultCertaintyThreshold: Double = 0.2

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
