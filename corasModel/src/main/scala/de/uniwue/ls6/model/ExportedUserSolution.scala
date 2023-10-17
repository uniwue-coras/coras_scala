package de.uniwue.ls6.model

import play.api.libs.json.{Json, OFormat}

import scala.annotation.unused

final case class ExportedUserSolution(
  username: String,
  userSolutionNodes: Seq[ExportedFlatUserSolutionNode],
  nodeMatches: Seq[ExportedSolutionNodeMatch],
  correctionStatus: CorrectionStatus,
  correctionSummary: Option[ExportedCorrectionSummary]
)

object ExportedUserSolution {

  val jsonFormat: OFormat[ExportedUserSolution] = {
    @unused implicit val exportedFlatUserSolutionNodeJsonFormat: OFormat[ExportedFlatUserSolutionNode] = ExportedFlatUserSolutionNode.jsonFormat
    @unused implicit val exportedSolutionNodeMatchJsonFormat: OFormat[ExportedSolutionNodeMatch]       = Json.format
    @unused implicit val exportedCorrectionSummaryJsonFormat: OFormat[ExportedCorrectionSummary]       = ExportedCorrectionSummary.jsonFormat

    Json.format
  }

}
