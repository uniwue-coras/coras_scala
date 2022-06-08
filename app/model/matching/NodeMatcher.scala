package model.matching

import model.{FlatSolutionEntry, SolutionEntry}
import scala.annotation.tailrec
import play.api.libs.json.{OFormat, Json, Format}
import model.SolutionEntrySubText

final case class NodeMatch(
  sampleValue: SolutionEntry,
  userValue: SolutionEntry,
  childMatchingResult: NodeMatchingResult
) extends Match[SolutionEntry]

final case class NodeMatchingResult(
  matches: Seq[NodeMatch],
  notMatchedSample: Seq[SolutionEntry],
  notMatchedUser: Seq[SolutionEntry]
) extends MatchingResult[SolutionEntry, NodeMatch]

object NodeMatcher extends Matcher[SolutionEntry, NodeMatch, NodeMatchingResult] {

  override protected def matches(sampleSolutionNode: SolutionEntry, userSolutionNode: SolutionEntry): Boolean =
    sampleSolutionNode.text == userSolutionNode.text

  override protected def createMatch(sampleValue: SolutionEntry, userValue: SolutionEntry): NodeMatch =
    NodeMatch(sampleValue, userValue, performMatching(sampleValue.children, userValue.children))

  override protected def createMatchingResult(matches: Seq[NodeMatch], notMatchedSample: Seq[SolutionEntry], notMatchedUser: Seq[SolutionEntry]) =
    NodeMatchingResult(matches, notMatchedSample, notMatchedUser)

  private val solutionEntryFormat: OFormat[SolutionEntry] = {

    implicit val solutionEntrySubTextFormat: OFormat[SolutionEntrySubText] = Json.format

    Json.format

  }

  private val nodeMatchFormat: OFormat[NodeMatch] = {

    implicit val x0: OFormat[SolutionEntry] = solutionEntryFormat

    implicit lazy val x1: Format[NodeMatchingResult] = nodeMatchingResultFormat

    Json.format[NodeMatch]

  }

  val nodeMatchingResultFormat: OFormat[NodeMatchingResult] = {

    implicit lazy val x0: OFormat[NodeMatch] = nodeMatchFormat

    implicit val x1: OFormat[SolutionEntry] = solutionEntryFormat

    Json.format

  }

}
