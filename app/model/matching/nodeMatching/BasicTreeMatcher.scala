package model.matching.nodeMatching

import model.matching.wordMatching.WordAnnotator
import model.matching.{Match, MatchingResult}
import model.{DefaultSolutionNodeMatch, SolutionNode, SubTextNode}

private type InterimNodeMatch = Match[AnnotatedSolutionNode, SolutionNodeMatchExplanation]

class BasicTreeMatcher:

  private val startTriple: (Seq[InterimNodeMatch], Seq[AnnotatedSolutionNode], Seq[AnnotatedSolutionNode]) = (Seq.empty, Seq.empty, Seq.empty)

  private def matchContainerTrees(
    sampleTree: Seq[SolutionNodeContainer],
    userTree: Seq[SolutionNodeContainer]
  ): MatchingResult[AnnotatedSolutionNode, SolutionNodeMatchExplanation] = {
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
        DefaultSolutionNodeMatch(sampleValue.id, userValue.id, explanation)
      }

  def buildTreeAndPerformMatching(
    wordAnnotator: WordAnnotator,
    sampleNodes: Seq[SolutionNode],
    sampleSubTextNodes: Seq[SubTextNode],
    userNodes: Seq[SolutionNode],
    userSubTextNodes: Seq[SubTextNode]
  ): Seq[DefaultSolutionNodeMatch] = {

    val treeBuilder = SolutionNodeContainerTreeBuilder(wordAnnotator)

    performMatching(
      sampleTree = treeBuilder.buildSolutionTree(sampleNodes, sampleSubTextNodes),
      userTree = treeBuilder.buildSolutionTree(userNodes, userSubTextNodes)
    )
  }
