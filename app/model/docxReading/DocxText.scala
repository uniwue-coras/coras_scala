package model.docxReading

import model.matching.ParagraphCitation
import play.api.libs.json.{Json, OFormat}

final case class DocxText(
  text: String,
  level: Option[Int] = None,
  extractedParagraphs: Seq[ParagraphCitation] = Seq.empty
)

object DocxText {

  @scala.annotation.unused
  private implicit val extractedJsonFormat: OFormat[ParagraphCitation] = Json.format

  val jsonFormat: OFormat[DocxText] = Json.format

}
