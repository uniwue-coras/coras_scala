package model.matching

import model.IFlatSolutionNode
import model.matching.WordMatcher.WordMatchingResult

final case class NodeIdMatch(
  sampleValue: Int,
  userValue: Int,
  explanation: Option[WordMatchingResult] = None
)

object TreeMatcher {

  private type MR = MatchingResult[IFlatSolutionNode, WordMatchingResult]

  private[matching] val nodeMatcher = new Matcher[IFlatSolutionNode, WordMatchingResult](
    checkCertainMatch = _.text.trim == _.text.trim,
    generateFuzzyMatchExplanation = (l, r) => WordMatcher.matchFromTexts(l.text, r.text),
    fuzzyMatchingRate = _.rate,
    certaintyThreshold = 0.2
  )

  private def performSameLevelMatching(
    sampleSolution: Seq[IFlatSolutionNode],
    userSolution: Seq[IFlatSolutionNode],
    currentParentIds: Option[(Int, Int)] = None
  ): MR = {

    // Find root / child nodes
    val (sampleNodes, remainingSampleNodes) = sampleSolution.partition { _.parentId == currentParentIds.map(_._1) }
    val (userNodes, remainingUserNodes)     = userSolution.partition { _.parentId == currentParentIds.map(_._2) }

    val initialMatchingResult = nodeMatcher.performMatching(sampleNodes, userNodes)

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

  def performMatching(sampleSolution: Seq[IFlatSolutionNode], userSolution: Seq[IFlatSolutionNode]): Seq[NodeIdMatch] = for {
    Match(sampleValue, userValue, certainty) <- performSameLevelMatching(sampleSolution, userSolution).matches

    // TODO: match all
  } yield NodeIdMatch(sampleValue.id, userValue.id, certainty)

}
