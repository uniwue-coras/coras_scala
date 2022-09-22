package model

final case class FlatSolutionNode(
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionNodeSubText],
  parentId: Option[Int]
)

final case class FlatSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int
)

final case class FlatCorrection(
  sampleSolution: Seq[FlatSolutionNode],
  userSolution: Seq[FlatSolutionNode],
  matchingResult: Seq[FlatSolutionNodeMatch]
)
