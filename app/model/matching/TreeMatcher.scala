package model.matching

import model.matching.WordMatcher.WordMatchingResult
import model.{IFlatSolutionNode, MatchStatus, SolutionNodeMatch}

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

  def performMatching(username: String, exerciseId: Int, sampleSolution: Seq[IFlatSolutionNode], userSolution: Seq[IFlatSolutionNode]): Seq[SolutionNodeMatch] =
    for {
      // TODO: match all...
      Match(sampleValue, userValue, certainty) <- performSameLevelMatching(sampleSolution, userSolution).matches
    } yield SolutionNodeMatch(username, exerciseId, sampleValue.id, userValue.id, MatchStatus.Automatic, certainty.map(_.rate))

}
