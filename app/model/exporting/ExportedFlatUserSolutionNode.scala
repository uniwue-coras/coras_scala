package model.exporting

import model.{Applicability, SolutionNode}
import play.api.libs.json.{Json, OFormat}

final case class ExportedFlatUserSolutionNode(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  annotations: Seq[ExportedAnnotation]
) extends SolutionNode

object ExportedFlatUserSolutionNode {
  val jsonFormat: OFormat[ExportedFlatUserSolutionNode] = {
    implicit val exportedAnnotationJsonFormat: OFormat[ExportedAnnotation] = Json.format

    Json.format
  }
}
