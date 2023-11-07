package model.ls6.model

import play.api.libs.json.{Json, OFormat}

import scala.annotation.unused

final case class ExportedData(
  abbreviations: Map[String, String],
  relatedWordsGroups: Seq[Seq[ExportedRelatedWord]],
  exercises: Seq[ExportedExercise]
)

object ExportedData {
  val jsonFormat: OFormat[ExportedData] = {
    @unused implicit val exportedExerciseJsonFormat: OFormat[ExportedExercise]       = ExportedExercise.jsonFormat
    @unused implicit val exportedRelatedWordJsonFormat: OFormat[ExportedRelatedWord] = ExportedRelatedWord.jsonFormat

    Json.format
  }
}
