package model

import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TreeMatcher}

class DbTreeMatcher(
  username: String,
  exerciseId: Int,
  abbreviations: Map[String, String],
  relatedWordGroups: Seq[Seq[RelatedWord]]
) extends TreeMatcher[DbSolutionNodeMatch](abbreviations, relatedWordGroups):

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    maybeExplanation: Option[SolutionNodeMatchExplanation]
  ): DbSolutionNodeMatch = DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, MatchStatus.Automatic, maybeExplanation.map(_.certainty))
