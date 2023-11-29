package model.matching.paragraphMatching

import scala.language.implicitConversions

trait ParagraphTestHelpers:
  extension (lawCode: String)
    def paragraph(paragraphNumber: Int): ParagraphCitation = ParagraphCitation("§", lawCode, paragraphNumber)
    def article(paragraphNumber: Int): ParagraphCitation   = ParagraphCitation("Art.", lawCode, paragraphNumber)

  extension (p: ParagraphCitation)
    def section(section: Int): ParagraphCitation     = p.copy(section = Some(section))
    def withRest(newRest: String): ParagraphCitation = p.copy(rest = newRest)
