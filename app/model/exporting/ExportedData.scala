package model.exporting

import play.api.libs.json.{Json, OFormat}

final case class ExportedData(
  abbreviations: Map[String, String],
  relatedWordsGroups: Seq[Seq[ExportedRelatedWord]],
  exercises: Seq[ExportedExercise]
)

object ExportedData {
  val jsonFormat: OFormat[ExportedData] = {
    implicit val exportedExerciseJsonFormat: OFormat[ExportedExercise]       = ExportedExercise.jsonFormat
    implicit val exportedRelatedWordJsonFormat: OFormat[ExportedRelatedWord] = ExportedRelatedWord.jsonFormat

    Json.format
  }
}
