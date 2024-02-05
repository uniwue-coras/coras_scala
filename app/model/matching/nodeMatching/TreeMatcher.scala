package model.matching.nodeMatching

import model.matching.paragraphMatching.ParagraphExtractor
import model.matching.{Match, MatchingResult, WordAnnotator}
import model.{DefaultSolutionNodeMatch, SolutionNode}

class TreeMatcher(wordAnnotator: WordAnnotator):

  private val emptyMatchingResult: MatchingResult[AnnotatedSolutionNode, SolutionNodeMatchExplanation] = MatchingResult.empty

  @deprecated
  private def prepareNode(node: SolutionNode): AnnotatedSolutionNode = {
    val (newText, extractedParagraphCitations) = ParagraphExtractor.extractAndReplace(node.text)

    AnnotatedSolutionNode(
      node.id,
      node.text,
      node.parentId,
      extractedParagraphCitations,
      wordsWithRelatedWords = wordAnnotator.resolveSynonyms(newText)
    )
  }

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
        val SolutionNodeContainer(sampleNode, sampleChildren) = sampleValue
        val SolutionNodeContainer(userNode, userChildren)     = userValue

        // match subtrees recursively
        val MatchingResult(subTreeMatches, sampleSubTreeRemaining, userSubTreeRemaining) = matchContainerTrees(sampleChildren, userChildren)

        val MatchingResult(bucketMatches, sampleNodesRemaining, userNodesRemaining) =
          // TODO: use higher certaintyThreshold for bucket matching?
          AnnotatedSolutionNodeMatcher.performMatching(sampleSubTreeRemaining, userSubTreeRemaining)

        // TODO: return triple of (InterimNodeMatch, Seq[FlatSolutionNodeWithData], Seq[FlatSolutionNodeWithData])

        currentMatchingResult + MatchingResult(
          Match(sampleNode, userNode, explanation) +: (subTreeMatches ++ bucketMatches),
          sampleNodesRemaining,
          userNodesRemaining
        )
    }

    MatchingResult(newRootMatches, sampleRootRemaining.map(_.node) ++ newSampleRemaining, userRootRemaining.map(_.node) ++ newUserRemaining)
  }

  def performMatching(sampleSolution: Seq[SolutionNode], userSolution: Seq[SolutionNode]): Seq[DefaultSolutionNodeMatch] = {

    val sampleSolutionNodes = sampleSolution map prepareNode
    val userSolutionNodes   = userSolution map prepareNode

    val sampleTree = SolutionNodeContainer.buildTree(sampleSolutionNodes)
    val userTree   = SolutionNodeContainer.buildTree(userSolutionNodes)

    matchContainerTrees(sampleTree, userTree).matches.map { case Match(sampleValue, userValue, explanation) =>
      DefaultSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, explanation)
    }

  }