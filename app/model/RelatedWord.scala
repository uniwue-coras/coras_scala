package model

import play.api.libs.json.{Json, OFormat}

trait RelatedWord {
  def word: String
  def isPositive: Boolean
}

final case class ExportedRelatedWord(
  word: String,
  isPositive: Boolean
) extends RelatedWord

object ExportedRelatedWord {
  val jsonFormat: OFormat[ExportedRelatedWord] = Json.format
}
