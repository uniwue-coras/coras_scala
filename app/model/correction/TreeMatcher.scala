package model.correction

import model.FlatSolutionNode
import model.correction.NounMatcher.NounMatchingResult

final case class Match[T, E](
  sampleValue: T,
  userValue: T,
  explanation: Option[E]
)

final case class NodeIdMatch(
  sampleValue: Int,
  userValue: Int,
  certainty: Option[Double]
)

final case class MatchingResult[T, E](
  matches: Seq[Match[T, E]],
  notMatchedSample: Seq[T],
  notMatchedUser: Seq[T]
) {

  lazy val rate: Double = matches.size + notMatchedSample.size + notMatchedUser.size match {
    case 0     => 0.0
    case other => matches.size.toDouble / other.toDouble
  }

}

object TreeMatcher {

  private type MR = MatchingResult[FlatSolutionNode, NounMatchingResult]

  private def mergeMatchingResults(mr1: MR, mr2: MR): MR = MatchingResult(
    mr1.matches ++ mr2.matches,
    mr1.notMatchedSample ++ mr2.notMatchedSample,
    mr1.notMatchedUser ++ mr2.notMatchedUser
  )

  private def performBothMatchingAlgorithms(sampleNodes: Seq[FlatSolutionNode], userNodes: Seq[FlatSolutionNode]): MR = {
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
  ): MR = {

    // Find root / child nodes
    val (sampleNodes, remainingSampleNodes) = sampleSolution.partition(_.parentId == currentParentIds.map(_._1))
    val (userNodes, remainingUserNodes)     = userSolution.partition(_.parentId == currentParentIds.map(_._2))

    val initialMatchingResult = performBothMatchingAlgorithms(sampleNodes, userNodes)

    // perform child matching
    initialMatchingResult.matches.foldLeft(initialMatchingResult) { case (accMatchingResult, nodeMatch) =>
      mergeMatchingResults(
        accMatchingResult,
        performSameLevelMatching(
          remainingSampleNodes,
          remainingUserNodes,
          Some(nodeMatch.sampleValue.id, nodeMatch.userValue.id)
        )
      )
    }

  }

  def performMatching(sampleSolution: Seq[FlatSolutionNode], userSolution: Seq[FlatSolutionNode]): Seq[NodeIdMatch] = for {
    Match(sampleValue, userValue, certainty) <- performSameLevelMatching(sampleSolution, userSolution).matches

    // TODO: match all
  } yield NodeIdMatch(sampleValue.id, userValue.id, certainty.map(_.rate) /* FIXME: don't save rate! */ )

}
