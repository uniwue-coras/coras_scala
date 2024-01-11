package model.exporting

import model.{Annotation, Applicability, SolutionNode}
import play.api.libs.json.{Json, OFormat}

final case class ExportedFlatUserSolutionNode(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  annotations: Seq[Annotation]
) extends SolutionNode
object ExportedFlatUserSolutionNode:
  val jsonFormat: OFormat[ExportedFlatUserSolutionNode] = {
    implicit val exportedAnnotationJsonFormat: OFormat[Annotation] = Json.format

    Json.format
  }
