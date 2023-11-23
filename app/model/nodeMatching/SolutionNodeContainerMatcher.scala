package model.nodeMatching

import model.matching.{FuzzyMatcher, MatchingResult}
import model.paragraphMatching.{ParagraphCitation, ParagraphMatcher}
import model.wordMatching.WordMatcher

@deprecated()
type SolutionNodeContainerMatchingResult = MatchingResult[SolutionNodeContainer, SolutionNodeMatchExplanation]

object SolutionNodeContainerMatcher extends FuzzyMatcher[SolutionNodeContainer, SolutionNodeMatchExplanation]:

  override protected val certaintyThreshold: Double = 0.2

  override protected def checkCertainMatch(left: SolutionNodeContainer, right: SolutionNodeContainer): Boolean =
    left.node.text.trim == right.node.text.trim

  private def matchParagraph(sampleParagraphs: Seq[ParagraphCitation], userParagraphs: Seq[ParagraphCitation]) =
    if (sampleParagraphs.nonEmpty || userParagraphs.nonEmpty) {
      Some(ParagraphMatcher.performMatching(sampleParagraphs, userParagraphs))
    } else None

  override protected def generateFuzzyMatchExplanation(
    sample: SolutionNodeContainer,
    user: SolutionNodeContainer
  ): SolutionNodeMatchExplanation = SolutionNodeMatchExplanation(
    WordMatcher.performMatching(sample.node.wordsWithRelatedWords, user.node.wordsWithRelatedWords),
    matchParagraph(sample.node.citedParagraphs.flatMap(_.citedParagraphs), user.node.citedParagraphs.flatMap(_.citedParagraphs))
  )
