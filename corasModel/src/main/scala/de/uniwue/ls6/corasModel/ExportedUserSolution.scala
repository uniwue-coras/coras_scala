package de.uniwue.ls6.corasModel

import play.api.libs.json.{Json, OFormat}

import scala.annotation.unused

final case class ExportedUserSolution(
  username: String,
  userSolutionNodes: Seq[ExportedFlatUserSolutionNode],
  correctionStatus: CorrectionStatus
)

object ExportedUserSolution {

  val jsonFormat: OFormat[ExportedUserSolution] = {
    @unused implicit val exportedFlatUserSolutionNodeJsonFormat: OFormat[ExportedFlatUserSolutionNode] = ExportedFlatUserSolutionNode.jsonFormat

    Json.format
  }

}
