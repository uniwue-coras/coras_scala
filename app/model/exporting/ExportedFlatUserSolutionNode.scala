package model.exporting

import model.{Annotation, Applicability, SolutionNode}
import play.api.libs.json.{Json, OFormat}

final case class ExportedFlatUserSolutionNode(
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  subTexts: Seq[ExportedUserSubTextNode],
  annotations: Seq[Annotation]
) extends SolutionNode

object ExportedFlatUserSolutionNode:
  val jsonFormat: OFormat[ExportedFlatUserSolutionNode] = {
    implicit val subTextNodeFormat: OFormat[ExportedUserSubTextNode] = ExportedUserSubTextNode.jsonFormat
    implicit val exportedAnnotationJsonFormat: OFormat[Annotation]   = Json.format

    Json.format
  }
