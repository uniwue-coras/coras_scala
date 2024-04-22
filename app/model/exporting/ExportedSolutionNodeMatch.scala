package model.exporting

import model.{MatchStatus, SolutionNodeMatch}
import model.Correctness

final case class ExportedSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  correctness: Correctness,
  certainty: Option[Double]
) extends SolutionNodeMatch
