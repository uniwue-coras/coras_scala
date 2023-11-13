package model.paragraphMatching

import play.api.libs.json.{Json, OFormat}

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

  val jsonFormat: OFormat[ParagraphCitationLocation] = {
    @scala.annotation.unused
    implicit val x0: OFormat[ParagraphCitation] = Json.format

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
