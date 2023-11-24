package model.matching.nodeMatching

import model.matching.paragraphMatching.{ParagraphMatcher, ParagraphMatchingResult}
import model.matching.wordMatching.{WordMatcher, WordMatchingResult}
import model.matching.{FuzzyMatcher, Match, MatchExplanation, MatchingParameters, MatchingResult}

final case class SolutionNodeMatchExplanation(
  wordMatchingResult: WordMatchingResult,
  maybeParagraphMatchingResult: Option[ParagraphMatchingResult] = None
) extends MatchExplanation:

  private val paragraphMatchingProportion = MatchingParameters.paragraphMatchingCertaintyProportion

  override lazy val certainty: Double = maybeParagraphMatchingResult match {
    case None                          => wordMatchingResult.certainty
    case Some(paragraphMatchingResult) =>
      // TODO: ignore if wordMatchingResult.certainty < 0.5?
      val parMatchAmount  = paragraphMatchingProportion * paragraphMatchingResult.certainty
      val wordMatchAmount = (1 - paragraphMatchingProportion) * wordMatchingResult.certainty

      parMatchAmount + wordMatchAmount
  }

type FlatSolutionNodeMatch          = Match[FlatSolutionNodeWithData, SolutionNodeMatchExplanation]
type FlatSolutionNodeMatchingResult = MatchingResult[FlatSolutionNodeWithData, SolutionNodeMatchExplanation]

class FlatSolutionNodeMatcher(certaintyThreshold: Double = MatchingParameters.defaultFuzzyNodeMatchingCertaintyThreshold)
    extends FuzzyMatcher[FlatSolutionNodeWithData, SolutionNodeMatchExplanation](certaintyThreshold):

  override protected def checkCertainMatch(left: FlatSolutionNodeWithData, right: FlatSolutionNodeWithData): Boolean =
    left.text.trim == right.text.trim

  override protected def generateFuzzyMatchExplanation(
    sampleNode: FlatSolutionNodeWithData,
    userNode: FlatSolutionNodeWithData
  ): SolutionNodeMatchExplanation = {
    // FIXME: use cited paragraphss!

    val sampleParagraphs = sampleNode.citedParagraphs
    val userParagraphs   = userNode.citedParagraphs

    val paragraphMatchingResult = if (sampleParagraphs.nonEmpty || userParagraphs.nonEmpty) {
      // TODO: compare paragraphs...
      Some(ParagraphMatcher.performMatching(sampleParagraphs.flatMap(_.citedParagraphs), userParagraphs.flatMap(_.citedParagraphs)))
    } else {
      None
    }

    SolutionNodeMatchExplanation(
      WordMatcher.performMatching(sampleNode.wordsWithRelatedWords, userNode.wordsWithRelatedWords),
      paragraphMatchingResult
    )
  }
