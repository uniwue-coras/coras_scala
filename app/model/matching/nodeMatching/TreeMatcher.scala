package model.matching.nodeMatching

import model.DefaultSolutionNodeMatch
import model.matching.{Match, MatchingResult}

object TreeMatcher:

  private val performBucketMatching = true

  private val emptyMatchingResult: MatchingResult[AnnotatedSolutionNode, SolutionNodeMatchExplanation] = MatchingResult.empty

  private def matchContainerTrees(
    sampleTree: Seq[SolutionNodeContainer],
    userTree: Seq[SolutionNodeContainer]
  ): MatchingResult[AnnotatedSolutionNode, SolutionNodeMatchExplanation] = {

    // match *only* root nodes for current subtree...
    val MatchingResult(
      rootMatches,
      sampleRootRemaining,
      userRootRemaining
    ) = SolutionNodeContainerMatcher.performMatching(sampleTree, userTree)

    val sampleRootRemainingNodes = sampleRootRemaining.map { _.node }
    val userRootRemainingNodes   = userRootRemaining.map { _.node }

    val MatchingResult(newRootMatches, newSampleRemaining, newUserRemaining) = rootMatches.foldLeft(emptyMatchingResult) {
      case (currentMatchingResult, Match(sampleValue, userValue, explanation)) =>
        // match subtrees recursively
        val MatchingResult(
          subTreeMatches,
          sampleSubTreeRemaining,
          userSubTreeRemaining
        ) = matchContainerTrees(sampleValue.children, userValue.children)

        if (performBucketMatching) {

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
        } else {
          // TODO: include sampleRootRemainingNodes & userRootRemainingNodes in foldLeft!
          val MatchingResult(
            mrSampleMatches,
            sr1,
            su1
          ) = AnnotatedSolutionNodeMatcher.performMatching(sampleRootRemainingNodes, userSubTreeRemaining)

          val MatchingResult(
            mrUserMatches,
            ms2,
            mu2
          ) = AnnotatedSolutionNodeMatcher.performMatching(sampleSubTreeRemaining, userRootRemainingNodes)

          currentMatchingResult + MatchingResult(
            Match(sampleValue.node, userValue.node, explanation) +: (subTreeMatches ++ mrSampleMatches ++ mrUserMatches),
            ms2,
            su1
          )
        }
    }

    MatchingResult(newRootMatches, sampleRootRemaining.map(_.node) ++ newSampleRemaining, userRootRemaining.map(_.node) ++ newUserRemaining)
  }

  def performMatching(sampleSolution: Seq[AnnotatedSolutionNode], userSolution: Seq[AnnotatedSolutionNode]): Seq[DefaultSolutionNodeMatch] = {
    // TODO: return MatchingResult!

    val sampleTree = SolutionNodeContainer.buildTree(sampleSolution)
    val userTree   = SolutionNodeContainer.buildTree(userSolution)

    matchContainerTrees(sampleTree, userTree).matches.map { case Match(sampleValue, userValue, explanation) =>
      DefaultSolutionNodeMatch(sampleValue.id, userValue.id, explanation)
    }

  }
