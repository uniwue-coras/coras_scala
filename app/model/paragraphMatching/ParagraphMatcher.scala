package model.paragraphMatching

import model.matching.{FuzzyMatcher, MatchExplanation}

final case class ParagraphMatchExplanation(
  paragraphTypeEqual: Boolean,
  lawCodeEqual: Boolean,
  paragraphNumberEqual: Boolean
) extends MatchExplanation {

  override lazy val certainty: Double = {
    val parTypeCertainty = if (paragraphTypeEqual) 0.25 else 0.0

    val lawCodeCertainty = if (lawCodeEqual) 0.25 else 0.0

    val parNumberCertainty = if (paragraphNumberEqual) 0.5 else 0.0

    parTypeCertainty + lawCodeCertainty + parNumberCertainty
  }

}

object ParagraphMatcher extends FuzzyMatcher[ParagraphCitation, ParagraphMatchExplanation] {

  override protected def checkCertainMatch(left: ParagraphCitation, right: ParagraphCitation): Boolean = {
    val lawCodeEqual   = left.lawCode == right.lawCode
    val parNumberEqual = left.paragraphNumber == right.paragraphNumber

    // TODO: more tests...

    lawCodeEqual && parNumberEqual
  }

  override protected val certaintyThreshold: Double = 0.4

  override protected def generateFuzzyMatchExplanation(
    left: ParagraphCitation,
    right: ParagraphCitation
  ): ParagraphMatchExplanation = ParagraphMatchExplanation(
    paragraphTypeEqual = left.paragraphType == right.paragraphType,
    lawCodeEqual = left.lawCode == right.lawCode,
    paragraphNumberEqual = left.paragraphNumber == right.paragraphNumber
  )

}
