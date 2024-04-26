package model.exporting

import model.CorrectionStatus
import play.api.libs.json.{Json, OFormat}

final case class ExportedUserSolution(
  username: String,
  userSolutionNodes: Seq[ExportedFlatUserSolutionNode],
  nodeMatches: Seq[ExportedSolutionNodeMatch],
  correctionStatus: CorrectionStatus,
  correctionSummary: Option[ExportedCorrectionSummary]
)

object ExportedUserSolution {
  val jsonFormat: OFormat[ExportedUserSolution] = {
    implicit val exportedFlatUserSolutionNodeJsonFormat: OFormat[ExportedFlatUserSolutionNode] = ExportedFlatUserSolutionNode.jsonFormat
    implicit val exportedSolutionNodeMatchJsonFormat: OFormat[ExportedSolutionNodeMatch]       = Json.format
    implicit val exportedCorrectionSummaryJsonFormat: OFormat[ExportedCorrectionSummary]       = ExportedCorrectionSummary.jsonFormat

    Json.format
  }
}
