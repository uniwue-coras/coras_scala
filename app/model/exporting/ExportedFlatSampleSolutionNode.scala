package model.exporting

import model.{Applicability, SolutionNode}
import play.api.libs.json.{Json, OFormat}

final case class ExportedFlatSampleSolutionNode(
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  subTextNodes: Seq[ExportedSampleSubTextNode]
) extends SolutionNode

object ExportedFlatSampleSolutionNode:
  val jsonFormat: OFormat[ExportedFlatSampleSolutionNode] = {
    implicit val subTextNodeFormat: OFormat[ExportedSampleSubTextNode] = Json.format

    Json.format
  }
