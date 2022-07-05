package model.matching

import model.{FlatSolutionNode, SolutionNodeSubText}
import play.api.libs.json.{Format, Json, OFormat}

final case class NodeMatch(
  sampleValue: FlatSolutionNode,
  userValue: FlatSolutionNode,
  childMatchingResult: NodeMatchingResult
) extends Match[FlatSolutionNode]

final case class NodeMatchingResult(
  matches: Seq[NodeMatch],
  notMatchedSample: Seq[FlatSolutionNode],
  notMatchedUser: Seq[FlatSolutionNode]
) extends MatchingResult[FlatSolutionNode, NodeMatch]

object NodeMatcher extends Matcher[FlatSolutionNode, NodeMatch, NodeMatchingResult] {

  override protected def matches(sampleSolutionNode: FlatSolutionNode, userSolutionNode: FlatSolutionNode): Boolean =
    sampleSolutionNode.text == userSolutionNode.text

  override protected def createMatch(sampleValue: FlatSolutionNode, userValue: FlatSolutionNode): NodeMatch =
    NodeMatch(sampleValue, userValue, performMatching(Seq.empty /*sampleValue.children*/, Seq.empty /*userValue.children*/ ))

  override protected def createMatchingResult(
    matches: Seq[NodeMatch],
    notMatchedSample: Seq[FlatSolutionNode],
    notMatchedUser: Seq[FlatSolutionNode]
  ): NodeMatchingResult = NodeMatchingResult(matches, notMatchedSample, notMatchedUser)

}

object NodeMatchingResult {

  private val flatSolutionEntryFormat: OFormat[FlatSolutionNode] = {
    implicit val solutionEntrySubTextFormat: OFormat[SolutionNodeSubText] = Json.format

    Json.format
  }

  private val nodeMatchFormat: OFormat[NodeMatch] = {
    implicit val x0: OFormat[FlatSolutionNode]       = flatSolutionEntryFormat
    implicit lazy val x1: Format[NodeMatchingResult] = nodeMatchingResultFormat

    Json.format[NodeMatch]
  }

  val nodeMatchingResultFormat: OFormat[NodeMatchingResult] = {
    implicit lazy val x0: OFormat[NodeMatch]   = nodeMatchFormat
    implicit val x1: OFormat[FlatSolutionNode] = flatSolutionEntryFormat

    Json.format
  }

}
