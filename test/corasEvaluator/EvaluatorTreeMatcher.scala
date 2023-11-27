package corasEvaluator

import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TreeMatcher}
import model.{MatchStatus, RelatedWord, SolutionNodeMatch}

final case class EvaluationNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  maybeExplanation: Option[SolutionNodeMatchExplanation]
) extends SolutionNodeMatch:
  override def certainty: Option[Double] = maybeExplanation.map(_.certainty)
  override def matchStatus: MatchStatus  = MatchStatus.Automatic

class EvaluatorTreeMatcher(abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]])
    extends TreeMatcher[EvaluationNodeMatch](abbreviations, relatedWordGroups):

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    maybeExplanation: Option[SolutionNodeMatchExplanation]
  ): EvaluationNodeMatch = EvaluationNodeMatch(sampleNodeId, userNodeId, maybeExplanation)
