package model.export

import model.{MatchStatus, SolutionNodeMatch}

final case class ExportedSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  certainty: Option[Double]
) extends SolutionNodeMatch
