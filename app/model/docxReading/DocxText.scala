package model.docxReading

import play.api.libs.json.{Json, OFormat}

final case class DocxText(
  text: String,
  level: Option[Int] = None
  // extractedParagraphs: Seq[ParagraphCitationLocation] = Seq.empty
)

object DocxText:
  val jsonFormat: OFormat[DocxText] = Json.format
