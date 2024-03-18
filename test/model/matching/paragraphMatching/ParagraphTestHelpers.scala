package model.matching.paragraphMatching

import model.{ParagraphCitation, ParagraphCitationLocation}

import scala.language.implicitConversions

trait ParagraphTestHelpers:
  extension (lawCode: String)
    def paragraph(paragraphNumber: String): ParagraphCitation = ParagraphCitation("§", lawCode, paragraphNumber)
    def article(paragraphNumber: String): ParagraphCitation   = ParagraphCitation("Art.", lawCode, paragraphNumber)

    def paragraphs(_x: Any*): Seq[ParagraphCitation] = ???

  extension (p: ParagraphCitation)
    def section(section: Int): ParagraphCitation     = p.copy(section = Some(section))
    def withRest(newRest: String): ParagraphCitation = p.copy(rest = newRest)

  protected def location(location: Range, citations: ParagraphCitation*): ParagraphCitationLocation = ParagraphCitationLocation(
    location.start,
    location.end,
    citations
  )
