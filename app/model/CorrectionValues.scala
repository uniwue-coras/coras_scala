package model

final case class CorrectionValues(
  sampleSolution: Seq[SolutionNode],
  userSolution: Seq[SolutionNode]
)
