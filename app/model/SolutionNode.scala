package model

import com.scalatsi.{TSIType, TSNamedType, TSType}
import play.api.libs.json.{Json, OFormat}

case class SolutionNodeSubText(
  text: String,
  applicability: Applicability
)

trait BaseSolutionNode {
  val id: Int
  val childIndex: Int
  val text: String
  val applicability: Applicability
  val subTexts: Seq[SolutionNodeSubText]
}

final case class SolutionNode(
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionNodeSubText],
  children: Seq[SolutionNode]
) extends BaseSolutionNode

object SolutionNode {

  val solutionNodeJsonFormat: OFormat[SolutionNode] = {
    implicit val solutionNodeSubTextJsonFormat: OFormat[SolutionNodeSubText] = Json.format

    Json.format
  }

  val solutionNodeTsType: TSIType[SolutionNode] = {
    implicit val x0: TSNamedType[SolutionNode] = TSType.external("ISolutionNode")
    implicit val x1: TSType[Applicability]     = Applicability.tsType

    TSType.fromCaseClass
  }

}
