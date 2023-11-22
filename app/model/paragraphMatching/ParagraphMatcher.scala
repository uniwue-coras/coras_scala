package model.paragraphMatching

import model.matching.{FuzzyMatcher, Match, MatchExplanation, MatchingResult}

final case class ParagraphCitationMatchExplanation(
  paragraphTypeEqual: Boolean,
  lawCodeEqual: Boolean,
  paragraphNumberEqual: Boolean
) extends MatchExplanation {

  private val parTypeWeight   = 1
  private val lawCodeWeight   = 6
  private val parNumberWeight = 10

  override lazy val certainty: Double = {
    val parTypeCertainty = if (paragraphTypeEqual) parTypeWeight else 0

    val lawCodeCertainty = if (lawCodeEqual) lawCodeWeight else 0

    val parNumberCertainty = if (paragraphNumberEqual) parNumberWeight else 0

    (parTypeCertainty + lawCodeCertainty + parNumberCertainty) / (parTypeWeight + lawCodeWeight + parNumberWeight).toDouble
  }

}

object ParagraphMatcher extends FuzzyMatcher[ParagraphCitation, ParagraphCitationMatchExplanation] {

  type ParagraphCitationMatch  = Match[ParagraphCitation, ParagraphCitationMatchExplanation]
  type ParagraphMatchingResult = MatchingResult[ParagraphCitation, ParagraphCitationMatchExplanation]

  override protected def checkCertainMatch(left: ParagraphCitation, right: ParagraphCitation): Boolean = {
    val paragraphTypeEqual = left.paragraphType == right.paragraphType
    val lawCodeEqual       = left.lawCode == right.lawCode
    val parNumberEqual     = left.paragraphNumber == right.paragraphNumber

    // TODO: more tests...

    paragraphTypeEqual && lawCodeEqual && parNumberEqual
  }

  override protected val certaintyThreshold: Double = 0.4

  override protected def generateFuzzyMatchExplanation(
    left: ParagraphCitation,
    right: ParagraphCitation
  ): ParagraphCitationMatchExplanation = ParagraphCitationMatchExplanation(
    paragraphTypeEqual = left.paragraphType == right.paragraphType,
    lawCodeEqual = left.lawCode == right.lawCode,
    paragraphNumberEqual = left.paragraphNumber == right.paragraphNumber
  )

}
