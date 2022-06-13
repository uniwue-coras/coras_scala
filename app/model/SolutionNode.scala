package model

import com.scalatsi.{TSIType, TSNamedType, TSType}
import play.api.libs.json.{Json, OFormat}

final case class SolutionNode(
  id: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionNodeSubText],
  children: Seq[SolutionNode]
) extends TreeNode[SolutionNode]

object SolutionNode {

  def flattenSolutionNode(node: SolutionNode, currentParentId: Option[Int]): (FlatSolutionNodeInput, Seq[SolutionNode]) = node match {
    case SolutionNode(id, text, applicability, subTexts, children) =>
      (
        FlatSolutionNodeInput(id, text, applicability, currentParentId, subTexts),
        children
      )
  }

  val jsonFormat: OFormat[SolutionNode] = {
    implicit val x0: OFormat[SolutionNodeSubText] = SolutionNodeSubText.jsonFormat

    Json.format
  }

  val tsType: TSIType[SolutionNode] = {
    implicit val x0: TSNamedType[SolutionNode] = TSType.external("ISolutionNode")
    implicit val x1: TSType[Applicability]     = Applicability.tsType

    TSType.fromCaseClass
  }

}
