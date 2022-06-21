package model

import com.scalatsi.{TSIType, TSNamedType, TSType}
import play.api.libs.json.{Json, OFormat}

case class SolutionNodeSubText(
  text: String,
  applicability: Applicability
)

final case class SolutionNode(
  id: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionNodeSubText],
  children: Seq[SolutionNode]
)

final case class MatchedSolutionNode(
  id: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionNodeSubText]
)

object SolutionNode {

  private implicit val solutionNodeSubTextJsonFormat: OFormat[SolutionNodeSubText] = Json.format

  val solutionNodeJsonFormat: OFormat[SolutionNode] = Json.format

  val matchedSolutionNodeJsonFormat: OFormat[MatchedSolutionNode] = Json.format

  val tsType: TSIType[SolutionNode] = {
    implicit val x0: TSNamedType[SolutionNode] = TSType.external("ISolutionNode")
    implicit val x1: TSType[Applicability]     = Applicability.tsType

    TSType.fromCaseClass
  }

}
