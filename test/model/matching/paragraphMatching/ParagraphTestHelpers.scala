package model.matching.paragraphMatching

import model.{ParagraphCitation, ParagraphCitationLocation}

// TODO: extend dsl?
trait ParagraphTestHelpers {

  implicit class StringLawCode(lawCode: String) {
    def paragraph(paragraphNumber: String): ParagraphCitation = ParagraphCitation("§", lawCode, paragraphNumber)
    def article(paragraphNumber: String): ParagraphCitation   = ParagraphCitation("Art.", lawCode, paragraphNumber)
  }

  /*
  extension(lawCode: String)
  def paragraph(paragraphNumber: String): ParagraphCitation = ParagraphCitation("§", lawCode, paragraphNumber)
  def article(paragraphNumber: String): ParagraphCitation   = ParagraphCitation("Art.", lawCode, paragraphNumber)
   */

  implicit class ParagraphCitationExtension(p: ParagraphCitation) {

    // extension(p: ParagraphCitation)
    def subParagraph(subParagraph: String): ParagraphCitation = p.copy(subParagraph = Some(subParagraph))
    def sentence(sentence: String): ParagraphCitation         = p.copy(sentence = Some(sentence))
    def number(number: String): ParagraphCitation             = p.copy(number = Some(number))
    def alternative(alternative: String): ParagraphCitation   = p.copy(alternative = Some(alternative))
  }

  protected def location(location: Range, citations: ParagraphCitation*): ParagraphCitationLocation = ParagraphCitationLocation(
    location.start,
    location.end,
    citations,
    rest = ""
  )
}
