package model.exporting

import model.{Annotation, Applicability}
import play.api.libs.json.{Json, OFormat}

final case class ExportedFlatUserSolutionNode(
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  subTextNodes: Seq[ExportedUserSubTextNode],
  annotations: Seq[Annotation]
) extends ExportedSolutionNode

object ExportedFlatUserSolutionNode:
  val jsonFormat: OFormat[ExportedFlatUserSolutionNode] = {
    implicit val subTextNodeFormat: OFormat[ExportedUserSubTextNode] = ExportedUserSubTextNode.jsonFormat
    implicit val exportedAnnotationJsonFormat: OFormat[Annotation]   = Json.format

    Json.format
  }
