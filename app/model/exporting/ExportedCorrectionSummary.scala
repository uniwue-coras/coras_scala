package model.exporting

import model.CorrectionSummary
import play.api.libs.json.{Json, OFormat}

final case class ExportedCorrectionSummary(
  comment: String,
  points: Int
) extends CorrectionSummary

object ExportedCorrectionSummary {
  val jsonFormat: OFormat[ExportedCorrectionSummary] = Json.format
}
