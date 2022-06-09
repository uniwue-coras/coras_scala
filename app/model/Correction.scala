package model

final case class FlatSolutionNode(
  id: Int,
  text: String,
  applicability: Applicability
)

final case class CorrectionMatch(
  sampleValue: FlatSolutionNode,
  userValue: FlatSolutionNode,
  childMatches: SolutionNodeMatchingResult
)

final case class SolutionNodeMatchingResult(
  matches: Seq[CorrectionMatch],
  notMatchedSample: Seq[SolutionNode],
  notMatchedUser: Seq[SolutionNode]
)

final case class Correction(
  rootMatchingResult: SolutionNodeMatchingResult
)
