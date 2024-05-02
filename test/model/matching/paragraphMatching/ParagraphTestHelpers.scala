package model.matching.paragraphMatching

import model.{ParagraphCitation, ParagraphCitationLocation}

import scala.language.implicitConversions

// TODO: extend dsl?
trait ParagraphTestHelpers {

  extension(lawCode: String)
  def paragraph(paragraphNumber: String): ParagraphCitation = ParagraphCitation("§", lawCode, paragraphNumber)
  def article(paragraphNumber: String): ParagraphCitation   = ParagraphCitation("Art.", lawCode, paragraphNumber)

  extension(p: ParagraphCitation)
  def subParagraph(subParagraph: String): ParagraphCitation = p.copy(subParagraph = Some(subParagraph))
  def sentence(sentence: String): ParagraphCitation         = p.copy(sentence = Some(sentence))
  def number(number: String): ParagraphCitation             = p.copy(number = Some(number))
  def alternative(alternative: String): ParagraphCitation   = p.copy(alternative = Some(alternative))

  protected def location(location: Range, citations: ParagraphCitation*): ParagraphCitationLocation = ParagraphCitationLocation(
    location.start,
    location.end,
    citations,
    rest = ""
  )
}
