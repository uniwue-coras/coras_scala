package model.exporting

import model.{MatchStatus}
import model.SolutionNodeMatch

final case class ExportedSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  certainty: Option[Double]
) extends SolutionNodeMatch
