package model.matching.paragraphMatching

import model.matching.{CertainMatch, MatchExplanation, CertainMatcher}
import model.matching.CertainMatchingResult

type ParagraphCitationMatch  = CertainMatch[ParagraphCitation]
type ParagraphMatchingResult = CertainMatchingResult[ParagraphCitation]

object ParagraphMatcher extends CertainMatcher[ParagraphCitation]:

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
    else Some(ParagraphMatcher.performCertainMatching(sampleParagraphs, userParagraphs))
