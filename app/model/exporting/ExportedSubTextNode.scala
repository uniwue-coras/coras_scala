package model.exporting

import model.{Annotation, Applicability, SubTextNode}
import play.api.libs.json.{Json, OFormat}

final case class ExportedSampleSubTextNode(
  nodeId: Int,
  id: Int,
  text: String,
  applicability: Applicability
) extends SubTextNode

final case class ExportedUserSubTextNode(
  nodeId: Int,
  id: Int,
  text: String,
  applicability: Applicability,
  annotations: Seq[Annotation]
) extends SubTextNode

object ExportedUserSubTextNode:
  val jsonFormat: OFormat[ExportedUserSubTextNode] = {
    implicit val annotationFormat: OFormat[Annotation] = Json.format

    Json.format
  }
