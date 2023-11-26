package corasEvaluator

import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TreeMatcher}
import model.{MatchStatus, RelatedWord, SolutionNodeMatch}

final case class EvaluationNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  maybeExplanation: Option[SolutionNodeMatchExplanation]
) extends SolutionNodeMatch:
  override def certainty: Option[Double] = maybeExplanation.map(_.certainty)

class EvaluatorTreeMatcher(abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]])
    extends TreeMatcher[EvaluationNodeMatch](abbreviations, relatedWordGroups):

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    maybeExplanation: Option[SolutionNodeMatchExplanation]
  ): EvaluationNodeMatch = EvaluationNodeMatch(sampleNodeId, userNodeId, matchStatus, maybeExplanation)
