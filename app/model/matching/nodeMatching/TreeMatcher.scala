package model.matching.nodeMatching

import model.matching.{Match, MatchingResult, WordAnnotator}
import model.{DefaultSolutionNodeMatch, SolutionNode}

class TreeMatcher(wordAnnotator: WordAnnotator):

  private val emptyMatchingResult: MatchingResult[AnnotatedSolutionNode, SolutionNodeMatchExplanation] = MatchingResult.empty

  private def matchContainerTrees(
    sampleTree: Seq[SolutionNodeContainer],
    userTree: Seq[SolutionNodeContainer]
  ): MatchingResult[AnnotatedSolutionNode, SolutionNodeMatchExplanation] = {
    // match root nodes for current subtree...
    val MatchingResult(
      rootMatches,
      sampleRootRemaining,
      userRootRemaining
    ) = SolutionNodeContainerMatcher.performMatching(sampleTree, userTree)

    val MatchingResult(newRootMatches, newSampleRemaining, newUserRemaining) = rootMatches.foldLeft(emptyMatchingResult) {
      case (currentMatchingResult, Match(sampleValue, userValue, explanation)) =>
        // match subTexts?

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
        ) = AnnotatedSolutionNodeMatcher.performMatching(sampleSubTreeRemaining, userSubTreeRemaining)

        currentMatchingResult + MatchingResult(
          Match(sampleValue.node, userValue.node, explanation) +: (subTreeMatches ++ bucketMatches),
          sampleNodesRemaining,
          userNodesRemaining
        )
    }

    MatchingResult(newRootMatches, sampleRootRemaining.map(_.node) ++ newSampleRemaining, userRootRemaining.map(_.node) ++ newUserRemaining)
  }

  def performMatching(sampleSolution: Seq[SolutionNode], userSolution: Seq[SolutionNode]): Seq[DefaultSolutionNodeMatch] = {

    val sampleSolutionNodes = sampleSolution map wordAnnotator.annotateNode
    val userSolutionNodes   = userSolution map wordAnnotator.annotateNode

    val sampleTree = SolutionNodeContainer.buildTree(sampleSolutionNodes)
    val userTree   = SolutionNodeContainer.buildTree(userSolutionNodes)

    matchContainerTrees(sampleTree, userTree).matches.map { case Match(sampleValue, userValue, explanation) =>
      DefaultSolutionNodeMatch(sampleValue.id, userValue.id, explanation)
    }

  }
