package model.docxReading

import model.paragraphMatching.ParagraphCitationLocation
import play.api.libs.json.{Json, OFormat}

final case class DocxText(
  text: String,
  level: Option[Int] = None,
  extractedParagraphs: Seq[ParagraphCitationLocation] = Seq.empty
)

object DocxText:
  val jsonFormat: OFormat[DocxText] = {
    implicit val extractedJsonFormat: OFormat[ParagraphCitationLocation] = ParagraphCitationLocation.jsonFormat

    Json.format
  }
