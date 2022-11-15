package model.correction

import model.FlatSolutionNode
import model.correction.WordMatcher.WordMatchingResult

final case class NodeIdMatch(
  sampleValue: Int,
  userValue: Int,
  explanation: Option[WordMatchingResult] = None
)

object TreeMatcher {

  private type MR = MatchingResult[FlatSolutionNode, WordMatchingResult]

  private def performSameLevelMatching(
    sampleSolution: Seq[FlatSolutionNode],
    userSolution: Seq[FlatSolutionNode],
    currentParentIds: Option[(Int, Int)] = None
  ): MR = {

    // Find root / child nodes
    val (sampleNodes, remainingSampleNodes) = sampleSolution.partition(_.parentId == currentParentIds.map(_._1))
    val (userNodes, remainingUserNodes)     = userSolution.partition(_.parentId == currentParentIds.map(_._2))

    val initialMatchingResult = NodeMatcher.performMatching(sampleNodes, userNodes)

    // perform child matching
    initialMatchingResult.matches.foldLeft(initialMatchingResult) { case (accMatchingResult, nodeMatch) =>
      MatchingResult.mergeMatchingResults(
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
  } yield NodeIdMatch(sampleValue.id, userValue.id, certainty)

}
