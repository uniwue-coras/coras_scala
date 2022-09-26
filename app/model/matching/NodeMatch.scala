package model.matching

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
