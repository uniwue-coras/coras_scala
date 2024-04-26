package model.exporting

import model.{Correctness, MatchStatus, SolutionNodeMatch}

final case class ExportedSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  paragraphCitationCorrectness: Correctness,
  explanationCorrectness: Correctness,
  certainty: Option[Double]
) extends SolutionNodeMatch
