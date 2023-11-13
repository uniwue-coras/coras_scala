package model.docxReading

import model.paragraphMatching.ParagraphCitationLocation
import play.api.libs.json.{Json, OFormat}

final case class DocxText(
  text: String,
  level: Option[Int] = None,
  extractedParagraphs: Seq[ParagraphCitationLocation] = Seq.empty
)

object DocxText {

  @scala.annotation.unused
  private implicit val extractedJsonFormat: OFormat[ParagraphCitationLocation] = ParagraphCitationLocation.jsonFormat

  val jsonFormat: OFormat[DocxText] = Json.format

}
