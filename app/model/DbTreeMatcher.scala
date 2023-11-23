package model

import model.nodeMatching.{FlatSolutionNodeMatchExplanation, TreeMatcher}

class DbTreeMatcher(
  username: String,
  exerciseId: Int,
  abbreviations: Map[String, String],
  relatedWordGroups: Seq[Seq[RelatedWord]]
) extends TreeMatcher[DbSolutionNodeMatch](abbreviations, relatedWordGroups):

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    maybeExplanation: Option[FlatSolutionNodeMatchExplanation]
  ): DbSolutionNodeMatch = DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, MatchStatus.Automatic, maybeExplanation.map(_.certainty))
