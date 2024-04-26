package model.exporting

import play.api.libs.json.{Json, OFormat}

final case class ExportedExercise(
  id: Int,
  title: String,
  sampleSolutionNodes: Seq[ExportedFlatSampleSolutionNode],
  userSolutions: Seq[ExportedUserSolution]
)

object ExportedExercise {
  val jsonFormat: OFormat[ExportedExercise] = {
    implicit val exportedFlatSampleSolutionNodeJsonFormat: OFormat[ExportedFlatSampleSolutionNode] = ExportedFlatSampleSolutionNode.jsonFormat
    implicit val exportedFlatUserSolutionNodeJsonFormat: OFormat[ExportedUserSolution]             = ExportedUserSolution.jsonFormat

    Json.format
  }
}
