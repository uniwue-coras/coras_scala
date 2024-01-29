package model.exporting

import model.Applicability
import play.api.libs.json.{Json, OFormat}

final case class ExportedFlatSampleSolutionNode(
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  subTextNodes: Seq[ExportedSampleSubTextNode]
) extends ExportedSolutionNode

object ExportedFlatSampleSolutionNode:
  val jsonFormat: OFormat[ExportedFlatSampleSolutionNode] = {
    implicit val subTextNodeFormat: OFormat[ExportedSampleSubTextNode] = Json.format

    Json.format
  }
