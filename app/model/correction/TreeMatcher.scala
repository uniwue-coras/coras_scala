package model.correction

import model.FlatSolutionNode

final case class Match[T](
  sampleValue: T,
  userValue: T,
  certainty: Option[Double]
)

final case class NodeIdMatch(
  sampleValue: Int,
  userValue: Int,
  certainty: Option[Double]
)

final case class MatchingResult[T](
  matches: Seq[Match[T]],
  notMatchedSample: Seq[T],
  notMatchedUser: Seq[T]
) {

  lazy val rate: Double = matches.size + notMatchedSample.size + notMatchedUser.size match {
    case 0     => 0.0
    case other => matches.size.toDouble / other.toDouble
  }

}

object TreeMatcher {

  private def performBothMatchingAlgorithms(sampleNodes: Seq[FlatSolutionNode], userNodes: Seq[FlatSolutionNode]): MatchingResult[FlatSolutionNode] = {
    // Equality matching
    val MatchingResult(matches, notMatchedSample, notMatchedUser) = CertainNodeMatcher.performMatching(sampleNodes, userNodes)

    // Similarity matching
    val MatchingResult(newMatches, newNotMatchedSample, newNotMatchedUser) = FuzzyNodeMatcher.performMatching(notMatchedSample, notMatchedUser)

    MatchingResult(matches ++ newMatches, newNotMatchedSample, newNotMatchedUser)
  }

  private def performSameLevelMatching(
    sampleSolution: Seq[FlatSolutionNode],
    userSolution: Seq[FlatSolutionNode],
    currentParentIds: Option[(Int, Int)] = None
  ): MatchingResult[FlatSolutionNode] = {

    // Find root / child nodes
    val (sampleNodes, remainingSampleNodes) = sampleSolution.partition(_.parentId == currentParentIds.map(_._1))
    val (userNodes, remainingUserNodes)     = userSolution.partition(_.parentId == currentParentIds.map(_._2))

    val MatchingResult(matches, notMatchedSample, notMatchedUser) = performBothMatchingAlgorithms(sampleNodes, userNodes)

    // perform child matching
    matches.foldLeft(MatchingResult(matches, notMatchedSample, notMatchedUser)) { case (MatchingResult(matches, notMatchedSample, notMatchedUser), nodeMatch) =>
      val MatchingResult(newMatches, newNotMatchedSample, newNotMatchedUser) =
        performSameLevelMatching(remainingSampleNodes, remainingUserNodes, Some(nodeMatch.sampleValue.id, nodeMatch.userValue.id))

      MatchingResult(matches ++ newMatches, notMatchedSample ++ newNotMatchedSample, notMatchedUser ++ newNotMatchedUser)
    }

  }

  def performMatching(sampleSolution: Seq[FlatSolutionNode], userSolution: Seq[FlatSolutionNode]): Seq[NodeIdMatch] = for {
    Match(sampleValue, userValue, certainty) <- performSameLevelMatching(sampleSolution, userSolution).matches

    // TODO: match all
  } yield NodeIdMatch(sampleValue.id, userValue.id, certainty)

}
