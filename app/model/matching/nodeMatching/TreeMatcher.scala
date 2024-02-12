package model.matching.nodeMatching

import model.DefaultSolutionNodeMatch
import model.matching.{Match, MatchingResult}

object TreeMatcher:

  private val sameLevelMatcher = AnnotatedSolutionNodeMatcher(0.2)
  private val bucketMatcher    = AnnotatedSolutionNodeMatcher(0.8)

  private def matchContainerTrees(
    sampleTree: Seq[AnnotatedSolutionNode],
    userTree: Seq[AnnotatedSolutionNode]
  ): MatchingResult[AnnotatedSolutionNode, SolutionNodeMatchExplanation] = {

    // match *only* root nodes for current subtree...
    val rootMatchingResult = sameLevelMatcher.performMatching(sampleTree, userTree)

    rootMatchingResult.matches.foldLeft(rootMatchingResult) { case (currentMatchingResult, currentMatch) =>
      // match subtrees recursively
      val MatchingResult(
        subTreeMatches,
        sampleSubTreeRemaining,
        userSubTreeRemaining
      ) = matchContainerTrees(currentMatch.sampleValue.children, currentMatch.userValue.children)

      val bucketMatchingResult = bucketMatcher.performMatching(sampleSubTreeRemaining, userSubTreeRemaining)

      currentMatchingResult + subTreeMatches + bucketMatchingResult
    }
  }

  def performMatching(
    sampleSolution: Seq[AnnotatedSolutionNode],
    userSolution: Seq[AnnotatedSolutionNode]
  ): Seq[DefaultSolutionNodeMatch] = matchContainerTrees(sampleSolution, userSolution).matches.map { case Match(sampleValue, userValue, explanation) =>
    DefaultSolutionNodeMatch(sampleValue.id, userValue.id, explanation)
  }
