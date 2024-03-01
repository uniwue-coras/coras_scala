package model.matching.nodeMatching

import model.matching.{MatchingResult}

type NodeMatchingResult = MatchingResult[AnnotatedSolutionNode, SolutionNodeMatchExplanation]

object TreeMatcher:

  def matchContainerTrees(sampleTree: SolutionTree, userTree: SolutionTree, currentParentIds: Option[(Int, Int)] = None): NodeMatchingResult = {

    val (sampleSubTreeRoots, userSubTreeRoots) = currentParentIds match
      case None                             => (sampleTree.rootNodes, userTree.rootNodes)
      case Some((sampleNodeId, userNodeId)) => (sampleTree.getChildrenFor(sampleNodeId), userTree.getChildrenFor(userNodeId))

    // match *only* root nodes for current subtree...
    val rootMatchingResult = AnnotatedSolutionNodeMatcher.performMatching(sampleSubTreeRoots, userSubTreeRoots)

    rootMatchingResult.matches.foldLeft(rootMatchingResult) { case (currentMatchingResult, currentMatch) =>
      // match subtrees recursively
      val MatchingResult(
        subTreeMatches,
        sampleSubTreeRemaining,
        userSubTreeRemaining
      ) = matchContainerTrees(sampleTree, userTree, Some((currentMatch.sampleValue.id, currentMatch.userValue.id)))

      val bucketMatchingResult = AnnotatedSolutionNodeMatcher.performMatching(sampleSubTreeRemaining, userSubTreeRemaining, 0.8)

      currentMatchingResult + subTreeMatches + bucketMatchingResult
    }
  }
