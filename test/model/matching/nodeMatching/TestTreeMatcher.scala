package model.matching.nodeMatching

import model.{MatchStatus, RelatedWord, SolutionNodeMatch}

final case class TestSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus = MatchStatus.Automatic,
  maybeExplanation: Option[SolutionNodeMatchExplanation] = None
) extends SolutionNodeMatch {
  override def certainty: Option[Double] = maybeExplanation.map(_.certainty)
}

class TestTreeMatcher(abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]])
    extends TreeMatcher[TestSolutionNodeMatch](abbreviations, relatedWordGroups):

  private def sortWordMatchingResult(expl: SolutionNodeMatchExplanation): SolutionNodeMatchExplanation = expl.copy(
    wordMatchingResult = expl.wordMatchingResult.copy(
      matches = expl.wordMatchingResult.matches.sortBy(_.sampleValue.word),
      notMatchedSample = expl.wordMatchingResult.notMatchedSample.sortBy(_.word),
      notMatchedUser = expl.wordMatchingResult.notMatchedUser.sortBy(_.word)
    )
  )

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    maybeExplanation: Option[SolutionNodeMatchExplanation]
  ): TestSolutionNodeMatch = maybeExplanation match {
    case None              => TestSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, None)
    case Some(explanation) => TestSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, Some(sortWordMatchingResult(explanation)))
  }
