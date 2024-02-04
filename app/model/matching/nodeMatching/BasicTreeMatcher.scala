package model.matching.nodeMatching

import model.matching.wordMatching.WordAnnotator
import model.matching.{Match, MatchingResult}
import model.{DefaultSolutionNodeMatch, SolutionNode, SolutionTree, SubTextNode}

private type InterimNodeMatch = Match[AnnotatedSolutionNode, SolutionNodeMatchExplanation]

class BasicTreeMatcher:

  private val emptyMatchingResult = MatchingResult.empty[AnnotatedSolutionNode, SolutionNodeMatchExplanation]

  private def matchContainerTrees(
    sampleTree: SolutionTree,
    userTree: SolutionTree,
    currentParentIds: Option[(Int, Int)]
  ): MatchingResult[AnnotatedSolutionNode, SolutionNodeMatchExplanation] = {

    val (sampleSubTreeRootNodes, userSubTreeRootNodes) = currentParentIds match {
      case Some((sampleParentId, userParentId)) => (sampleTree.getChildrenFor(sampleParentId), userTree.getChildrenFor(userParentId))
      case None                                 => (sampleTree.getRootNodes, userTree.getRootNodes)
    }

    // match root nodes for current subtree...
    val MatchingResult(
      rootMatches,
      sampleRootRemaining,
      userRootRemaining
    ) = FlatSolutionNodeMatcher.performMatching(sampleSubTreeRootNodes, userSubTreeRootNodes)

    // try matching subtrees recursively
    val MatchingResult(newRootMatches, newSampleRemaining, newUserRemaining) = rootMatches.foldLeft(emptyMatchingResult) {
      case (
            MatchingResult(currentMatches, currentRemainingSampleNodes, currentRemainingUserNodes),
            Match(sampleNode, userNode, explanation)
          ) =>
        // match subtrees recursively
        val MatchingResult(
          subTreeMatches,
          sampleSubTreeRemaining,
          userSubTreeRemaining
        ) = matchContainerTrees(sampleTree, userTree, Some(sampleNode.id, userNode.id))

        // TODO: use higher certaintyThreshold for bucket matching?
        val MatchingResult(
          bucketMatches,
          sampleNodesRemaining,
          userNodesRemaining
        ) = FlatSolutionNodeMatcher.performMatching(sampleSubTreeRemaining, userSubTreeRemaining)

        // TODO: return triple of (InterimNodeMatch, Seq[FlatSolutionNodeWithData], Seq[FlatSolutionNodeWithData])

        val newMatches: Seq[InterimNodeMatch] = Match(sampleNode, userNode, explanation) +: (subTreeMatches ++ bucketMatches)

        MatchingResult(
          currentMatches ++ newMatches,
          currentRemainingSampleNodes ++ sampleNodesRemaining,
          currentRemainingUserNodes ++ userNodesRemaining
        )
    }

    MatchingResult(
      matches = newRootMatches,
      notMatchedSample = sampleRootRemaining ++ newSampleRemaining,
      notMatchedUser = userRootRemaining ++ newUserRemaining
    )
  }

  def performMatching(
    sampleTree: SolutionTree,
    userTree: SolutionTree
  ): Seq[DefaultSolutionNodeMatch] = matchContainerTrees(sampleTree, userTree, None).matches.map { case Match(sampleValue, userValue, explanation) =>
    DefaultSolutionNodeMatch(sampleValue, userValue, explanation)
  }

  def buildTreeAndPerformMatching(
    wordAnnotator: WordAnnotator,
    sampleNodes: Seq[SolutionNode],
    sampleSubTextNodes: Seq[SubTextNode],
    userNodes: Seq[SolutionNode],
    userSubTextNodes: Seq[SubTextNode]
  ): Seq[DefaultSolutionNodeMatch] = performMatching(
    sampleTree = SolutionTree.buildFrom(wordAnnotator, sampleNodes, sampleSubTextNodes),
    userTree = SolutionTree.buildFrom(wordAnnotator, userNodes, userSubTextNodes)
  )
