package model

import model.nodeMatching.{FlatSolutionNodeMatchExplanation, TreeMatcher}

class DbTreeMatcher(username: String, exerciseId: Int, abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]])
    extends TreeMatcher(abbreviations, relatedWordGroups):

  override protected type SolNodeMatch = DbSolutionNodeMatch

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    maybeExplanation: Option[FlatSolutionNodeMatchExplanation]
  ): SolNodeMatch = DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, MatchStatus.Automatic, maybeExplanation.map(_.certainty))
