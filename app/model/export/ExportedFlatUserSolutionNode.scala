package model.export

import model.SolutionNode
import model.enums.Applicability
import play.api.libs.json.{Json, OFormat}

import scala.annotation.unused

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
    @unused implicit val exportedAnnotationJsonFormat: OFormat[ExportedAnnotation] = Json.format

    Json.format
  }

}
