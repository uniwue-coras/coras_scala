package model.matching.paragraphMatching

import play.api.libs.json.{Json, OFormat}

final case class ParagraphCitation(
  paragraphType: String,
  lawCode: String,
  paragraphNumber: Int,
  section: Option[Int] = None,
  rest: String = ""
)

final case class ParagraphCitationLocation(
  from: Int,
  to: Int,
  citedParagraphs: Seq[ParagraphCitation]
)

type CitedParag = (Int, String)

object ParagraphCitationLocation:

  val paragraphCitationFormat: OFormat[ParagraphCitation] = Json.format

  val jsonFormat: OFormat[ParagraphCitationLocation] = {
    implicit val x0: OFormat[ParagraphCitation] = paragraphCitationFormat

    Json.format
  }
