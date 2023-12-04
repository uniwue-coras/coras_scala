package model.matching.nodeMatching

import model.{MatchStatus, RelatedWord, SolutionNodeMatch}

final case class TestSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  maybeExplanation: Option[SolutionNodeMatchExplanation] = None
) extends SolutionNodeMatch:
  override def certainty: Option[Double] = maybeExplanation.map(_.certainty)
  override val matchStatus: MatchStatus  = MatchStatus.Automatic

class TestTreeMatcher(abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]])
    extends TreeMatcher[TestSolutionNodeMatch](abbreviations, relatedWordGroups):

  private def sortWordMatchingResult(expl: SolutionNodeMatchExplanation): SolutionNodeMatchExplanation = expl.copy(
    wordMatchingResult = expl.wordMatchingResult.copy(
      certainMatches = expl.wordMatchingResult.certainMatches.sortBy(_.sampleValue.word),
      fuzzyMatches = expl.wordMatchingResult.fuzzyMatches.sortBy(_.sampleValue.word),
      notMatchedSample = expl.wordMatchingResult.notMatchedSample.sortBy(_.word),
      notMatchedUser = expl.wordMatchingResult.notMatchedUser.sortBy(_.word)
    )
  )

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    maybeExplanation: Option[SolutionNodeMatchExplanation]
  ): TestSolutionNodeMatch = TestSolutionNodeMatch(sampleNodeId, userNodeId, maybeExplanation.map(sortWordMatchingResult))
