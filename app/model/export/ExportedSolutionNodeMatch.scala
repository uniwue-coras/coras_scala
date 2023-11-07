package model.export

import model.SolutionNodeMatch
import model.enums.MatchStatus

final case class ExportedSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  certainty: Option[Double]
) extends SolutionNodeMatch
