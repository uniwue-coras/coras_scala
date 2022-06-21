package model

import com.scalatsi.{TSIType, TSNamedType, TSType}

final case class NodeCorrectionMatch(
  sampleValue: MatchedSolutionNode,
  userValue: MatchedSolutionNode,
  childMatches: SolutionNodeMatchingResult
)

final case class SolutionNodeMatchingResult(
  matches: Seq[NodeCorrectionMatch],
  notMatchedSample: Seq[SolutionNode],
  notMatchedUser: Seq[SolutionNode]
)

final case class Correction(
  rootMatchingResult: SolutionNodeMatchingResult
)

object Correction {

  // JSON format

  import play.api.libs.functional.syntax._
  import play.api.libs.json._

  private implicit val solutionNodeJsonFormat: OFormat[SolutionNode] = SolutionNode.solutionNodeJsonFormat

  private implicit val matchedSolutionNodeJsonFormat: OFormat[MatchedSolutionNode] = SolutionNode.matchedSolutionNodeJsonFormat

  private implicit lazy val nodeCorrectionMatchJsonFormat: Format[NodeCorrectionMatch] = (
    (__ \ "sampleValue").format[MatchedSolutionNode] and
      (__ \ "userValue").format[MatchedSolutionNode] and
      (__ \ "childMatches").lazyFormat[SolutionNodeMatchingResult](solutionNodeMatchingResultJsonFormat)
  )(NodeCorrectionMatch.apply, unlift(NodeCorrectionMatch.unapply))

  private implicit val solutionNodeMatchingResultJsonFormat: OFormat[SolutionNodeMatchingResult] = (
    (__ \ "matches").format[Seq[NodeCorrectionMatch]] and
      (__ \ "notMatchedSample").format[Seq[SolutionNode]] and
      (__ \ "notMatchedUser").format[Seq[SolutionNode]]
  )(SolutionNodeMatchingResult.apply, unlift(SolutionNodeMatchingResult.unapply))

  val correctionJsonFormat: OFormat[Correction] = Json.format

  // TS Type

  private val nodeCorrectionMatchType: TSIType[NodeCorrectionMatch] = {
    implicit val x0: TSNamedType[SolutionNodeMatchingResult] = TSType.external[SolutionNodeMatchingResult]("ISolutionNodeMatchingResult")
    implicit val x1: TSIType[MatchedSolutionNode]            = SolutionNode.matchedSolutionNodeType

    TSType.fromCaseClass
  }

  private val solutionNodeMatchingResultType: TSIType[SolutionNodeMatchingResult] = {
    implicit val x0: TSIType[NodeCorrectionMatch] = nodeCorrectionMatchType
    implicit val x1: TSIType[SolutionNode]        = SolutionNode.solutionNodeTsType

    TSType.fromCaseClass
  }

  val correctionType: TSIType[Correction] = {
    implicit val x0: TSIType[SolutionNodeMatchingResult] = solutionNodeMatchingResultType

    TSType.fromCaseClass
  }

}
