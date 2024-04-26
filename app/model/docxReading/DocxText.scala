package model.docxReading

import play.api.libs.json.{Json, OFormat}

final case class DocxText(
  text: String,
  level: Option[Int] = None
)

object DocxText {
  val jsonFormat: OFormat[DocxText] = Json.format
}
