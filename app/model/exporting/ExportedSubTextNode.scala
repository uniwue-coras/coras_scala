package model.exporting

import model.{Annotation, Applicability}
import play.api.libs.json.{Json, OFormat}

trait ExportedSubTextNode:
  def id: Int
  def text: String
  def applicability: Applicability

final case class ExportedSampleSubTextNode(
  id: Int,
  text: String,
  applicability: Applicability
) extends ExportedSubTextNode

final case class ExportedUserSubTextNode(
  id: Int,
  text: String,
  applicability: Applicability,
  annotations: Seq[Annotation]
) extends ExportedSubTextNode

object ExportedUserSubTextNode:
  val jsonFormat: OFormat[ExportedUserSubTextNode] = {
    implicit val annotationFormat: OFormat[Annotation] = Json.format

    Json.format
  }
