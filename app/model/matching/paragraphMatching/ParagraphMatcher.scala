package model.matching.paragraphMatching

import model.matching.{Match, MatchExplanation, Matcher, MatchingResult}

final case class ParagraphCitationMatchExplanation(
  paragraphTypeEqual: Boolean,
  lawCodeEqual: Boolean,
  paragraphNumberEqual: Boolean
) extends MatchExplanation:

  private val parTypeWeight   = 1
  private val lawCodeWeight   = 6
  private val parNumberWeight = 10

  override lazy val certainty: Double = {
    val parTypeCertainty = if paragraphTypeEqual then parTypeWeight else 0

    val lawCodeCertainty = if lawCodeEqual then lawCodeWeight else 0

    val parNumberCertainty = if paragraphNumberEqual then parNumberWeight else 0

    (parTypeCertainty + lawCodeCertainty + parNumberCertainty) / (parTypeWeight + lawCodeWeight + parNumberWeight).toDouble
  }

type ParagraphCitationMatch  = Match[ParagraphCitation, ParagraphCitationMatchExplanation]
type ParagraphMatchingResult = MatchingResult[ParagraphCitation, ParagraphCitationMatchExplanation]

object ParagraphMatcher extends Matcher[ParagraphCitation, ParagraphCitationMatchExplanation]:

  override protected def checkCertainMatch(left: ParagraphCitation, right: ParagraphCitation): Boolean = {
    val paragraphTypeEqual = left.paragraphType == right.paragraphType
    val lawCodeEqual       = left.lawCode == right.lawCode
    val parNumberEqual     = left.paragraphNumber == right.paragraphNumber

    // TODO: more tests...

    paragraphTypeEqual && lawCodeEqual && parNumberEqual
  }

  def generateResult(
    sampleParagraphs: Seq[ParagraphCitation],
    userParagraphs: Seq[ParagraphCitation]
  ): Option[ParagraphMatchingResult] =
    if sampleParagraphs.isEmpty && userParagraphs.isEmpty then None
    else Some(ParagraphMatcher.performMatching(sampleParagraphs, userParagraphs))
