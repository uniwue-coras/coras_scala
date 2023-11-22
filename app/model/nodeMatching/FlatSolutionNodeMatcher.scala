package model.nodeMatching

import model.matching.{FuzzyMatcher, Match, MatchExplanation, MatchingResult}
import model.paragraphMatching.{ParagraphMatcher, ParagraphMatchingResult}
import model.wordMatching.{WordMatcher, WordMatchingResult}

final case class FlatSolutionNodeMatchExplanation(
  wordMatchingResult: WordMatchingResult,
  maybeParagraphMatchingResult: Option[ParagraphMatchingResult] = None
) extends MatchExplanation {

  private val paragraphMatchingProportion = 0.3

  override lazy val certainty: Double = maybeParagraphMatchingResult match {
    case None                          => wordMatchingResult.certainty
    case Some(paragraphMatchingResult) =>
      // TODO: ignore if wordMatchingResult.certainty < 0.5?
      val parMatchAmount  = paragraphMatchingProportion * paragraphMatchingResult.certainty
      val wordMatchAmount = (1 - paragraphMatchingProportion) * wordMatchingResult.certainty

      parMatchAmount + wordMatchAmount
  }

}

type FlatSolutionNodeMatch          = Match[FlatSolutionNodeWithData, FlatSolutionNodeMatchExplanation]
type FlatSolutionNodeMatchingResult = MatchingResult[FlatSolutionNodeWithData, FlatSolutionNodeMatchExplanation]

object FlatSolutionNodeMatcher extends FuzzyMatcher[FlatSolutionNodeWithData, FlatSolutionNodeMatchExplanation]:

  override protected val certaintyThreshold = 0.2

  override protected def checkCertainMatch(left: FlatSolutionNodeWithData, right: FlatSolutionNodeWithData): Boolean =
    left.text.trim == right.text.trim

  override protected def generateFuzzyMatchExplanation(
    sampleNode: FlatSolutionNodeWithData,
    userNode: FlatSolutionNodeWithData
  ): FlatSolutionNodeMatchExplanation = {
    // FIXME: use cited paragraphss!

    val sampleParagraphs = sampleNode.citedParagraphs
    val userParagraphs   = userNode.citedParagraphs

    val paragraphMatchingResult = if (sampleParagraphs.nonEmpty || userParagraphs.nonEmpty) {
      // TODO: compare paragraphs...
      Some(ParagraphMatcher.performMatching(sampleParagraphs.flatMap(_.citedParagraphs), userParagraphs.flatMap(_.citedParagraphs)))
    } else {
      None
    }

    FlatSolutionNodeMatchExplanation(
      model.wordMatching.WordMatcher.performMatching(sampleNode.wordsWithRelatedWords, userNode.wordsWithRelatedWords),
      paragraphMatchingResult
    )
  }
