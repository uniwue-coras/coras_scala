package model.ls6.model

import play.api.libs.json.{Json, OFormat}

import scala.annotation.unused

final case class ExportedExercise(
  id: Int,
  title: String,
  text: String,
  sampleSolutionNodes: Seq[ExportedFlatSampleSolutionNode],
  userSolutions: Seq[ExportedUserSolution]
)

object ExportedExercise {

  val jsonFormat: OFormat[ExportedExercise] = {
    @unused implicit val exportedFlatSampleSolutionNodeJsonFormat: OFormat[ExportedFlatSampleSolutionNode] = ExportedFlatSampleSolutionNode.jsonFormat
    @unused implicit val exportedFlatUserSolutionNodeJsonFormat: OFormat[ExportedUserSolution]             = ExportedUserSolution.jsonFormat

    Json.format
  }

}
