package model.exporting

import play.api.libs.json.{Json, OFormat}
import model.RelatedWord

final case class ExportedData(
  abbreviations: Map[String, String],
  relatedWordsGroups: Seq[Seq[RelatedWord]],
  exercises: Seq[ExportedExercise]
)

object ExportedData:
  val jsonFormat: OFormat[ExportedData] = {
    implicit val exportedExerciseJsonFormat: OFormat[ExportedExercise] = ExportedExercise.jsonFormat
    implicit val relatedWordJsonFormat: OFormat[RelatedWord]           = Json.format

    Json.format
  }
