package model.matching

import model.FlatSolutionNode

object TreeMatcher {

  private val certainNodeMatcher: CertainMatcher[FlatSolutionNode] = (sv, uv) => sv.text.trim == uv.text.trim

  private val nounRegex = "\\p{Lu}\\p{L}+".r

  private def extractNouns(text: String): Seq[String] = nounRegex.findAllIn(text).toSeq

  private val fuzzyNodeMatcher: FuzzyMatcher[FlatSolutionNode] = (sampleNode, userNode) => {
    val sampleNouns = extractNouns(sampleNode.text).toSet
    val userNouns   = extractNouns(userNode.text).toSet

    (sampleNouns & userNouns).size match {
      case 0            => 0.0
      case intersection => intersection.toDouble / (sampleNouns | userNouns).size.toDouble
    }
  }

  private def convertMatches(matches: Seq[Match[FlatSolutionNode]]): Seq[NodeMatch] = matches.map {
    case CertainMatch(sampleValue, userValue)          => CertainNodeMatch(sampleValue.id, userValue.id)
    case FuzzyMatch(sampleValue, userValue, certainty) => FuzzyNodeMatch(sampleValue.id, userValue.id, certainty)
  }

  private def performBothMatchingAlgorithms(sampleNodes: Seq[FlatSolutionNode], userNodes: Seq[FlatSolutionNode]): NodeMatchingResult = {
    // Equality matching
    val MatchingResult(matches, notMatchedSample, notMatchedUser) = certainNodeMatcher.performMatching(sampleNodes, userNodes)

    // Similarity matching
    val MatchingResult(newMatches, newNotMatchedSample, newNotMatchedUser) = fuzzyNodeMatcher.performMatching(notMatchedSample, notMatchedUser)

    NodeMatchingResult(convertMatches(matches) ++ convertMatches(newMatches), newNotMatchedSample.map(_.id), newNotMatchedUser.map(_.id))
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

  def performMatching(sampleSolution: Seq[FlatSolutionNode], userSolution: Seq[FlatSolutionNode]): NodeMatchingResult = {
    performSameLevelMatching(sampleSolution, userSolution)

    // TODO: match all
  }

}
