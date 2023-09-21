package de.uniwue.ls6.corasModel

import play.api.libs.json.{Json, OFormat}

trait CorrectionSummary {
  def comment: String
  def points: Int
}

final case class ExportedCorrectionSummary(comment: String, points: Int) extends CorrectionSummary

object ExportedCorrectionSummary {
  val jsonFormat: OFormat[ExportedCorrectionSummary] = Json.format
}
