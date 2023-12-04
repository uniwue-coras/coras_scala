package model.matching.nodeMatching

import model.matching.wordMatching.{WordExtractor, WordWithRelatedWords}
import model.matching.{CertainMatch, CompleteMatchingResult, FuzzyMatch, FuzzyMatcher}
import model.{RelatedWord, SolutionNode, SolutionNodeMatch}

trait TreeMatcher[+SolNodeMatch <: SolutionNodeMatch](
  abbreviations: Map[String, String],
  relatedWordGroups: Seq[Seq[RelatedWord]]
):

  protected val bucketMatcher: FuzzyMatcher[FlatSolutionNodeWithData, SolutionNodeMatchExplanation] = FlatSolutionNodeMatcher

  private def resolveSynonyms(text: String): Seq[WordWithRelatedWords] = WordExtractor.extractWordsNew(text).map { word =>

    val realWord = abbreviations.getOrElse(word, word)

    val (synonyms, antonyms) = relatedWordGroups
      .find { _.exists { _.word == realWord } }
      .getOrElse(Seq.empty)
      .filter { _.word != realWord }
      .partition { _.isPositive }

    WordWithRelatedWords(realWord, synonyms.map(_.word), antonyms.map(_.word))
  }

  private def prepareNode(node: SolutionNode): FlatSolutionNodeWithData =
    FlatSolutionNodeWithData(node, wordsWithRelatedWords = resolveSynonyms(node.remainingText))

  protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    maybeExplanation: Option[SolutionNodeMatchExplanation]
  ): SolNodeMatch

  private type InterimCertainMatch = CertainMatch[FlatSolutionNodeWithData]
  private type InterimFuzzyMatch   = FuzzyMatch[FlatSolutionNodeWithData, SolutionNodeMatchExplanation]
  private type InterimValues       = (Seq[InterimCertainMatch], Seq[InterimFuzzyMatch], Seq[FlatSolutionNodeWithData], Seq[FlatSolutionNodeWithData])

  private val startInterimValues: InterimValues = (Seq.empty, Seq.empty, Seq.empty, Seq.empty)

  private def matchContainerTrees(
    sampleTree: Seq[SolutionNodeContainer],
    userTree: Seq[SolutionNodeContainer]
  ): CompleteMatchingResult[FlatSolutionNodeWithData, SolutionNodeMatchExplanation] = {
    // match root nodes for current subtree...
    val CompleteMatchingResult(
      certainRootMatches,
      fuzzyRootMatches,
      sampleRootRemaining,
      userRootRemaining
    ) = SolutionNodeContainerMatcher.performMatching(sampleTree, userTree)

    val allRootMatches = certainRootMatches ++ fuzzyRootMatches

    val sampleRootNodesRemaining = sampleRootRemaining.map(_.node)
    val userRootNodesRemaining   = userRootRemaining.map(_.node)

    val (newCertainRootMatches, newFuzzyRootMatches, newSampleRemaining, newUserRemaining) = allRootMatches.foldLeft[InterimValues](startInterimValues) {
      case (
            (currentCertainMatches, currentFuzzyMatches, currentRemainingSampleNodes, currentRemainingUserNodes),
            rootMatch
          ) =>
        val SolutionNodeContainer(sampleNode, sampleChildren) = rootMatch.sampleValue
        val SolutionNodeContainer(userNode, userChildren)     = rootMatch.userValue

        // match subtrees recursively
        val CompleteMatchingResult(
          certainSubTreeMatches,
          fuzzySubTreeMatches,
          sampleSubTreeRemaining,
          userSubTreeRemaining
        ) = matchContainerTrees(sampleChildren, userChildren)

        // TODO: use higher certaintyThreshold for bucket matching?
        val CompleteMatchingResult(
          certainLeftBucketMatches,
          fuzzyLeftBucketMatches,
          leftSampleNodesRemaining,
          leftUserNodesRemaining
        ) = FlatSolutionNodeMatcher.performMatching(sampleRootNodesRemaining, userSubTreeRemaining)

        val CompleteMatchingResult(
          certainRightBucketMatches,
          fuzzyRightBucketMatches,
          rightSampleNodesRemaining,
          rightUserNodesRemaining
        ) = FlatSolutionNodeMatcher.performMatching(sampleSubTreeRemaining, userRootNodesRemaining)

        val newCertainMatches: Seq[InterimCertainMatch] = certainSubTreeMatches ++ certainLeftBucketMatches ++ certainRightBucketMatches
        val newFuzzyMatches: Seq[InterimFuzzyMatch]     = fuzzySubTreeMatches ++ fuzzyLeftBucketMatches ++ fuzzyRightBucketMatches

        rootMatch match
          case CertainMatch(_, _) =>
            (
              (currentCertainMatches :+ CertainMatch(sampleNode, userNode)) ++ newCertainMatches,
              currentFuzzyMatches ++ newFuzzyMatches,
              currentRemainingSampleNodes ++ leftSampleNodesRemaining ++ rightSampleNodesRemaining,
              currentRemainingUserNodes ++ leftUserNodesRemaining ++ rightUserNodesRemaining
            )
          case FuzzyMatch(_, _, explanation) =>
            (
              currentCertainMatches ++ newCertainMatches,
              (currentFuzzyMatches :+ FuzzyMatch(sampleNode, userNode, explanation)) ++ newFuzzyMatches,
              currentRemainingSampleNodes ++ leftSampleNodesRemaining ++ rightSampleNodesRemaining,
              currentRemainingUserNodes ++ leftUserNodesRemaining ++ rightUserNodesRemaining
            )
    }

    CompleteMatchingResult(
      newCertainRootMatches,
      newFuzzyRootMatches,
      newSampleRemaining,
      newUserRemaining
    )
  }

  def performMatching(sampleSolution: Seq[SolutionNode], userSolution: Seq[SolutionNode]): Seq[SolNodeMatch] = {

    val sampleTree = SolutionNodeContainer.buildTree(sampleSolution map prepareNode)
    val userTree   = SolutionNodeContainer.buildTree(userSolution map prepareNode)

    val matchingResult = matchContainerTrees(sampleTree, userTree)

    val certainMatches = matchingResult.certainMatches.map { case CertainMatch(sampleValue, userValue) =>
      createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, None)
    }

    val fuzzyMatches = matchingResult.fuzzyMatches.map { case FuzzyMatch(sampleValue, userValue, explanation) =>
      createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, Some(explanation))
    }

    certainMatches ++ fuzzyMatches

  }
