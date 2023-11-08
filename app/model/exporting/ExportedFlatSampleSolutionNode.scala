package model.exporting

import model.{Applicability, SolutionNode}
import play.api.libs.json.{Json, OFormat}

final case class ExportedFlatSampleSolutionNode(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends SolutionNode

object ExportedFlatSampleSolutionNode {

  val jsonFormat: OFormat[ExportedFlatSampleSolutionNode] = Json.format

}
