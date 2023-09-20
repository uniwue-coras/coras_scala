package de.uniwue.ls6.corasModel

import play.api.libs.json.{Json, OFormat}

final case class ExportedFlatSampleSolutionNode(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
)

object ExportedFlatSampleSolutionNode {

  val jsonFormat: OFormat[ExportedFlatSampleSolutionNode] = Json.format

}
