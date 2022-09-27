package model.correction

import model.FlatSolutionNode

final case class NodeMatch(
  sampleValue: Int,
  userValue: Int,
  certainty: Option[Double]
)

private final case class NodeMatchingResult(
  matches: Seq[NodeMatch],
  notMatchedSample: Seq[Int],
  notMatchedUser: Seq[Int]
)

final case class MatchingResult[MatchContentType](
  matches: Seq[NodeMatch],
  notMatchedSample: Seq[MatchContentType],
  notMatchedUser: Seq[MatchContentType]
)

object TreeMatcher {

  private def performBothMatchingAlgorithms(sampleNodes: Seq[FlatSolutionNode], userNodes: Seq[FlatSolutionNode]): NodeMatchingResult = {
    // Equality matching
    val MatchingResult(matches, notMatchedSample, notMatchedUser) = CertainNodeMatcher.performMatching(sampleNodes, userNodes)

    // Similarity matching
    val MatchingResult(newMatches, newNotMatchedSample, newNotMatchedUser) = FuzzyNodeMatcher.performMatching(notMatchedSample, notMatchedUser)

    NodeMatchingResult(matches ++ newMatches, newNotMatchedSample.map(_.id), newNotMatchedUser.map(_.id))
  }

  private def performSameLevelMatching(
    sampleSolution: Seq[FlatSolutionNode],
    userSolution: Seq[FlatSolutionNode],
    currentParentIds: Option[(Int, Int)] = None
  ): NodeMatchingResult = {

    // Find root / child nodes
    val (sampleNodes, remainingSampleNodes) = sampleSolution.partition(_.parentId == currentParentIds.map(_._1))
    val (userNodes, remainingUserNodes)     = userSolution.partition(_.parentId == currentParentIds.map(_._2))

    val NodeMatchingResult(matches, notMatchedSample, notMatchedUser) = performBothMatchingAlgorithms(sampleNodes, userNodes)

    // perform child matching
    matches.foldLeft(NodeMatchingResult(matches, notMatchedSample, notMatchedUser)) {
      case (NodeMatchingResult(matches, notMatchedSample, notMatchedUser), nodeMatch) =>
        val NodeMatchingResult(newMatches, newNotMatchedSample, newNotMatchedUser) =
          performSameLevelMatching(remainingSampleNodes, remainingUserNodes, Some(nodeMatch.sampleValue, nodeMatch.userValue))

        NodeMatchingResult(matches ++ newMatches, notMatchedSample ++ newNotMatchedSample, notMatchedUser ++ newNotMatchedUser)
    }

  }

  def performMatching(sampleSolution: Seq[FlatSolutionNode], userSolution: Seq[FlatSolutionNode]): Seq[NodeMatch] = {
    performSameLevelMatching(sampleSolution, userSolution).matches

    // TODO: match all
  }

}
