package corasEvaluator

import model.exporting.ExportedSolutionNodeMatch
import model.nodeMatching.{SolutionNodeMatchExplanation, TreeMatcher}
import model.{MatchStatus, RelatedWord}

class EvaluatorTreeMatcher(abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]])
    extends TreeMatcher[ExportedSolutionNodeMatch](abbreviations, relatedWordGroups):

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    maybeExplanation: Option[SolutionNodeMatchExplanation]
  ): ExportedSolutionNodeMatch = ExportedSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, maybeExplanation.map(_.certainty))
