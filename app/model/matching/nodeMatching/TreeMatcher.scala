package model.matching.nodeMatching

import model.DefaultSolutionNodeMatch
import model.matching.{Match, MatchingResult}

object TreeMatcher:

  private val emptyMatchingResult: MatchingResult[AnnotatedSolutionNode, SolutionNodeMatchExplanation] = MatchingResult.empty

  private def matchContainerTrees(
    sampleTree: Seq[AnnotatedSolutionNode],
    userTree: Seq[AnnotatedSolutionNode]
  ): MatchingResult[AnnotatedSolutionNode, SolutionNodeMatchExplanation] = {

    // match *only* root nodes for current subtree...
    val MatchingResult(
      rootMatches,
      sampleRootRemaining,
      userRootRemaining
    ) = SolutionNodeContainerMatcher(0.2).performMatching(sampleTree, userTree)

    val MatchingResult(newRootMatches, newSampleRemaining, newUserRemaining) = rootMatches.foldLeft(emptyMatchingResult) {
      case (currentMatchingResult, Match(sampleValue, userValue, explanation)) =>
        // match subtrees recursively
        val MatchingResult(
          subTreeMatches,
          sampleSubTreeRemaining,
          userSubTreeRemaining
        ) = matchContainerTrees(sampleValue.children, userValue.children)

        val MatchingResult(
          bucketMatches,
          sampleNodesRemaining,
          userNodesRemaining
        ) = SolutionNodeContainerMatcher(0.6).performMatching(sampleSubTreeRemaining, userSubTreeRemaining)

        currentMatchingResult + MatchingResult(
          Match(sampleValue, userValue, explanation) +: (subTreeMatches ++ bucketMatches),
          sampleNodesRemaining,
          userNodesRemaining
        )

    }

    MatchingResult(newRootMatches, sampleRootRemaining ++ newSampleRemaining, userRootRemaining ++ newUserRemaining)
  }

  def performMatching(
    sampleSolution: Seq[AnnotatedSolutionNode],
    userSolution: Seq[AnnotatedSolutionNode]
  ): Seq[DefaultSolutionNodeMatch] = {
    // TODO: return MatchingResult!

    matchContainerTrees(sampleSolution, userSolution).matches.map { case Match(sampleValue, userValue, explanation) =>
      DefaultSolutionNodeMatch(sampleValue.id, userValue.id, explanation)
    }

  }
