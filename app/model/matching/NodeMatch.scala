package model.matching

import model.{FlatSolutionNode, SolutionNodeSubText}
import play.api.libs.json.{Json, OFormat}

sealed trait NodeMatch {
  val sampleValue: Int
  val userValue: Int
}

final case class CertainNodeMatch(
  sampleValue: Int,
  userValue: Int
) extends NodeMatch

final case class FuzzyNodeMatch(
  sampleValue: Int,
  userValue: Int,
  certainty: Double
) extends NodeMatch

final case class NodeMatchingResult(
  matches: Seq[NodeMatch],
  notMatchedSample: Seq[Int],
  notMatchedUser: Seq[Int]
)

object NodeMatchingResult {

  val flatSolutionNodeJsonFormat: OFormat[FlatSolutionNode] = {
    implicit val solutionEntrySubTextFormat: OFormat[SolutionNodeSubText] = Json.format

    Json.format
  }

  private val nodeMatchFormat: OFormat[NodeMatch] = {
    implicit val x0: OFormat[FlatSolutionNode] = flatSolutionNodeJsonFormat

    implicit val x1: OFormat[CertainNodeMatch] = Json.format
    implicit val x2: OFormat[FuzzyNodeMatch]   = Json.format

    Json.format[NodeMatch]
  }

  val nodeMatchingResultFormat: OFormat[NodeMatchingResult] = {
    implicit val x0: OFormat[NodeMatch]        = nodeMatchFormat
    implicit val x1: OFormat[FlatSolutionNode] = flatSolutionNodeJsonFormat

    Json.format
  }

}
