package model

import model.ls6.matching.TreeMatcher
import model.ls6.matching.WordMatcher.WordMatchingResult
import model.ls6.model.MatchStatus

class DbTreeMatcher(username: String, exerciseId: Int) extends TreeMatcher {

  override protected type SolNodeMatch = DbSolutionNodeMatch

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    certainty: Option[WordMatchingResult]
  ): SolNodeMatch = DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, MatchStatus.Automatic, certainty.map(_.rate))

}
