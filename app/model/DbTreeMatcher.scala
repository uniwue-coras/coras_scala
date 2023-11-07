package model

import model.matching.TreeMatcher
import model.matching.WordMatcher.WordMatchingResult

class DbTreeMatcher(username: String, exerciseId: Int) extends TreeMatcher {

  override protected type SolNodeMatch = DbSolutionNodeMatch

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    certainty: Option[WordMatchingResult]
  ): SolNodeMatch = DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, MatchStatus.Automatic, certainty.map(_.rate))

}
