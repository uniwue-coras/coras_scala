package model.exporting

import model.CorrectionStatus
import play.api.libs.json.{Json, OFormat}
import model.CorrectionSummary
import model.SolutionNodeMatch

final case class ExportedUserSolution(
  username: String,
  userSolutionNodes: Seq[ExportedFlatUserSolutionNode],
  nodeMatches: Seq[SolutionNodeMatch],
  correctionStatus: CorrectionStatus,
  correctionSummary: Option[CorrectionSummary]
)

object ExportedUserSolution:
  val jsonFormat: OFormat[ExportedUserSolution] =
    implicit val exportedFlatUserSolutionNodeJsonFormat: OFormat[ExportedFlatUserSolutionNode] = ExportedFlatUserSolutionNode.jsonFormat
    implicit val exportedSolutionNodeMatchJsonFormat: OFormat[SolutionNodeMatch]             = Json.format
    implicit val exportedCorrectionSummaryJsonFormat: OFormat[CorrectionSummary]               = Json.format

    Json.format
