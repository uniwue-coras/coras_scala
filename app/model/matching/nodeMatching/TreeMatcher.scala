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
    // match root nodes for current subtree...
    val MatchingResult(
      rootMatches,
      sampleRootRemaining,
      userRootRemaining
    ) = SolutionNodeContainerMatcher.performMatching(sampleTree, userTree)

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
          currentMatchingResult + MatchingResult(
            Match(sampleValue.node, userValue.node, explanation) +: (subTreeMatches ++ Seq.empty),
            sampleSubTreeRemaining,
            userSubTreeRemaining
          )
        }
    }

    MatchingResult(newRootMatches, sampleRootRemaining.map(_.node) ++ newSampleRemaining, userRootRemaining.map(_.node) ++ newUserRemaining)
  }

  def performMatching(sampleSolution: Seq[AnnotatedSolutionNode], userSolution: Seq[AnnotatedSolutionNode]): Seq[DefaultSolutionNodeMatch] = {

    // val sampleSolutionNodes = sampleSolution map wordAnnotator.annotateNode
    // val userSolutionNodes   = userSolution map wordAnnotator.annotateNode

    val sampleTree = SolutionNodeContainer.buildTree(sampleSolution)
    val userTree   = SolutionNodeContainer.buildTree(userSolution)

    matchContainerTrees(sampleTree, userTree).matches.map { case Match(sampleValue, userValue, explanation) =>
      DefaultSolutionNodeMatch(sampleValue.id, userValue.id, explanation)
    }

  }
