package model.exporting

import model.RelatedWord
import play.api.libs.json.{Json, OFormat}

final case class ExportedRelatedWord(
  word: String,
  isPositive: Boolean
) extends RelatedWord

object ExportedRelatedWord:
  val jsonFormat: OFormat[ExportedRelatedWord] = Json.format
