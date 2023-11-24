package model.matching.paragraphMatching

import play.api.libs.json.{Json, OFormat}

import scala.annotation.unused

final case class ParagraphCitation(
  paragraphType: String,
  lawCode: String,
  paragraphNumber: Int,
  rest: String
)

final case class ParagraphCitationLocation(
  from: Int,
  to: Int,
  citedParagraphs: Seq[ParagraphCitation]
)

object ParagraphCitationLocation {

  type CitedParag = (Int, String)

  val paragraphCitationFormat: OFormat[ParagraphCitation] = Json.format

  val jsonFormat: OFormat[ParagraphCitationLocation] = {
    @unused implicit val x0: OFormat[ParagraphCitation] = paragraphCitationFormat

    Json.format
  }

  def apply(from: Int, to: Int, paragraphType: String, lawCode: String, citedParagraphs: CitedParag*): ParagraphCitationLocation =
    ParagraphCitationLocation(
      from,
      to,
      citedParagraphs.map { case (paragraphNumber, rest) =>
        ParagraphCitation(paragraphType, lawCode, paragraphNumber, rest)
      }
    )
}
