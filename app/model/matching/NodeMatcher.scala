package model.matching

import model.{SolutionNode, SolutionNodeSubText}
import play.api.libs.json.{Format, Json, OFormat}

final case class NodeMatch(
  sampleValue: SolutionNode,
  userValue: SolutionNode,
  childMatchingResult: NodeMatchingResult
) extends Match[SolutionNode]

final case class NodeMatchingResult(
  matches: Seq[NodeMatch],
  notMatchedSample: Seq[SolutionNode],
  notMatchedUser: Seq[SolutionNode]
) extends MatchingResult[SolutionNode, NodeMatch]

object NodeMatcher extends Matcher[SolutionNode, NodeMatch, NodeMatchingResult] {

  override protected def matches(sampleSolutionNode: SolutionNode, userSolutionNode: SolutionNode): Boolean =
    sampleSolutionNode.text == userSolutionNode.text

  override protected def createMatch(sampleValue: SolutionNode, userValue: SolutionNode): NodeMatch =
    NodeMatch(sampleValue, userValue, performMatching(sampleValue.children, userValue.children))

  override protected def createMatchingResult(
    matches: Seq[NodeMatch],
    notMatchedSample: Seq[SolutionNode],
    notMatchedUser: Seq[SolutionNode]
  ): NodeMatchingResult = NodeMatchingResult(matches, notMatchedSample, notMatchedUser)

  private val solutionEntryFormat: OFormat[SolutionNode] = {
    implicit val solutionEntrySubTextFormat: OFormat[SolutionNodeSubText] = Json.format

    Json.format
  }

  private val nodeMatchFormat: OFormat[NodeMatch] = {
    implicit val x0: OFormat[SolutionNode]           = solutionEntryFormat
    implicit lazy val x1: Format[NodeMatchingResult] = nodeMatchingResultFormat

    Json.format[NodeMatch]
  }

  val nodeMatchingResultFormat: OFormat[NodeMatchingResult] = {
    implicit lazy val x0: OFormat[NodeMatch] = nodeMatchFormat
    implicit val x1: OFormat[SolutionNode]   = solutionEntryFormat

    Json.format
  }

}
