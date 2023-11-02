package model.docxReading

import de.uniwue.ls6.matching.ParagraphExtraction
import play.api.libs.json.{Json, OFormat}

final case class DocxText(
  text: String,
  level: Option[Int] = None,
  extractedParagraphs: Seq[ParagraphExtraction] = Seq.empty
)

object DocxText {

  @scala.annotation.unused
  private implicit val extractedJsonFormat: OFormat[ParagraphExtraction] = Json.format

  val jsonFormat: OFormat[DocxText] = Json.format

}
