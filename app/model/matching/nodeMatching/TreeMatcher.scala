package model.matching.nodeMatching

import model.matching.{Match, MatchingResult}
import model.{DefaultSolutionNodeMatch}

private type InterimNodeMatch = Match[FlatSolutionNodeWithData, SolutionNodeMatchExplanation]

private type FoldContent = (Seq[InterimNodeMatch], Seq[FlatSolutionNodeWithData], Seq[FlatSolutionNodeWithData])

class TreeMatcher:

  private val startTriple: FoldContent = (Seq.empty, Seq.empty, Seq.empty)

  private def matchContainerTrees(
    sampleTree: Seq[SolutionNodeContainer],
    userTree: Seq[SolutionNodeContainer]
  ): MatchingResult[FlatSolutionNodeWithData, SolutionNodeMatchExplanation] = {
    // match root nodes for current subtree...
    val MatchingResult(rootMatches, sampleRootRemaining, userRootRemaining) = SolutionNodeContainerMatcher.performMatching(sampleTree, userTree)

    val (newRootMatches, newSampleRemaining, newUserRemaining) = rootMatches.foldLeft(startTriple) {
      case (
            (currentMatches, currentRemainingSampleNodes, currentRemainingUserNodes),
            Match(sampleValue, userValue, explanation)
          ) =>
        val SolutionNodeContainer(sampleNode, sampleChildren) = sampleValue
        val SolutionNodeContainer(userNode, userChildren)     = userValue

        // match subtrees recursively
        val MatchingResult(subTreeMatches, sampleSubTreeRemaining, userSubTreeRemaining) = matchContainerTrees(sampleChildren, userChildren)

        // TODO: use higher certaintyThreshold for bucket matching?
        val MatchingResult(bucketMatches, sampleNodesRemaining, userNodesRemaining) =
          FlatSolutionNodeMatcher.performMatching(sampleSubTreeRemaining, userSubTreeRemaining)

        // TODO: return triple of (InterimNodeMatch, Seq[FlatSolutionNodeWithData], Seq[FlatSolutionNodeWithData])

        val newMatches: Seq[InterimNodeMatch] = Match(sampleNode, userNode, explanation) +: (subTreeMatches ++ bucketMatches)

        (currentMatches ++ newMatches, currentRemainingSampleNodes ++ sampleNodesRemaining, currentRemainingUserNodes ++ userNodesRemaining)
    }

    MatchingResult(newRootMatches, sampleRootRemaining.map(_.node) ++ newSampleRemaining, userRootRemaining.map(_.node) ++ newUserRemaining)
  }

  def performMatching(sampleTree: Seq[SolutionNodeContainer], userTree: Seq[SolutionNodeContainer]): Seq[DefaultSolutionNodeMatch] =
    matchContainerTrees(sampleTree, userTree).matches
      .map { case Match(sampleValue, userValue, explanation) =>
        DefaultSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, explanation)
      }
