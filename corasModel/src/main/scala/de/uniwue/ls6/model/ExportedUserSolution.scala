package de.uniwue.ls6.model

import play.api.libs.json.{Json, OFormat}

import scala.annotation.unused

final case class ExportedUserSolution(
  username: String,
  userSolutionNodes: Seq[ExportedFlatUserSolutionNode],
  correctionStatus: CorrectionStatus,
  correctionSummary: Option[ExportedCorrectionSummary]
)

object ExportedUserSolution {

  val jsonFormat: OFormat[ExportedUserSolution] = {
    @unused implicit val exportedFlatUserSolutionNodeJsonFormat: OFormat[ExportedFlatUserSolutionNode] = ExportedFlatUserSolutionNode.jsonFormat
    @unused implicit val exportedCorrectionSummaryJsonFormat: OFormat[ExportedCorrectionSummary]       = ExportedCorrectionSummary.jsonFormat

    Json.format
  }

}
