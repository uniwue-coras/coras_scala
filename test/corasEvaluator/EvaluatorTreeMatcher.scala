package corasEvaluator

import model.MatchStatus
import model.exporting.ExportedSolutionNodeMatch
import model.nodeMatching.{FlatSolutionNodeMatchExplanation, TreeMatcher}
import model.RelatedWord

class EvaluatorTreeMatcher(abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]]) extends TreeMatcher(abbreviations, relatedWordGroups):

  override protected type SolNodeMatch = ExportedSolutionNodeMatch

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    maybeExplanation: Option[FlatSolutionNodeMatchExplanation]
  ): SolNodeMatch = ExportedSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, maybeExplanation.map(_.certainty))
