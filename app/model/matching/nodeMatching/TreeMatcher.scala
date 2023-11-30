package model.matching.nodeMatching

import model.matching.paragraphMatching.ParagraphExtractor
import model.matching.wordMatching.WordWithRelatedWords
import model.matching.{CompleteMatchingResult, CertainMatch, FuzzyMatch}
import model.{RelatedWord, SolutionNode, SolutionNodeMatch}

trait TreeMatcher[SolNodeMatch <: SolutionNodeMatch](abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]]):

  private def resolveSynonyms(text: String): Seq[WordWithRelatedWords] = for {
    word <- model.matching.wordMatching.WordExtractor.extractWordsNew(text)

    realWord = abbreviations.getOrElse(word, word)

    (synonyms, antonyms) = relatedWordGroups
      .find { _.exists { _.word == realWord } }
      .getOrElse(Seq.empty)
      .filter { _.word != realWord }
      .partition { _.isPositive }
  } yield WordWithRelatedWords(realWord, synonyms.map(_.word), antonyms.map(_.word))

  private def prepareNode(node: SolutionNode): FlatSolutionNodeWithData = {
    val (newText, extractedParagraphCitations) = ParagraphExtractor.extractAndReplace(node.text)

    FlatSolutionNodeWithData(
      node.id,
      node.text,
      node.parentId,
      extractedParagraphCitations,
      wordsWithRelatedWords = resolveSynonyms(newText)
    )
  }

  protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    maybeExplanation: Option[SolutionNodeMatchExplanation]
  ): SolNodeMatch

  private type InterimCertainMatch = CertainMatch[FlatSolutionNodeWithData]
  private type InterimFuzzyMatch   = FuzzyMatch[FlatSolutionNodeWithData, SolutionNodeMatchExplanation]

  type InterimValues = (Seq[InterimCertainMatch], Seq[InterimFuzzyMatch], Seq[FlatSolutionNodeWithData], Seq[FlatSolutionNodeWithData])

  private val startInterimValues: InterimValues = (Seq.empty, Seq.empty, Seq.empty, Seq.empty)

  private def matchContainerTrees(
    sampleTree: Seq[SolutionNodeContainer],
    userTree: Seq[SolutionNodeContainer]
  ): CompleteMatchingResult[FlatSolutionNodeWithData, SolutionNodeMatchExplanation] = {
    // match root nodes for current subtree...
    val CompleteMatchingResult(certainRootMatches, fuzzyRootMatches, sampleRootRemaining, userRootRemaining) =
      SolutionNodeContainerMatcher.performMatching(sampleTree, userTree)

    val allRootMatches = certainRootMatches ++ fuzzyRootMatches

    val (newCertainRootMatches, newFuzzyRootMatches, newSampleRemaining, newUserRemaining) = allRootMatches.foldLeft(startInterimValues) {
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

        // use higher certaintyThreshold for bucket matching?
        val CompleteMatchingResult(
          certainBucketMatches,
          fuzzyBucketMatches,
          sampleNodesRemaining,
          userNodesRemaining
        ) = FlatSolutionNodeMatcher.performMatching(sampleSubTreeRemaining, userSubTreeRemaining)

        val newCertainMatches: Seq[InterimCertainMatch] = certainSubTreeMatches ++ certainBucketMatches
        val newFuzzyMatches: Seq[InterimFuzzyMatch]     = fuzzySubTreeMatches ++ fuzzyBucketMatches

        rootMatch match
          case CertainMatch(_, _) =>
            (
              (currentCertainMatches :+ CertainMatch(sampleNode, userNode)) ++ newCertainMatches,
              currentFuzzyMatches ++ newFuzzyMatches,
              currentRemainingSampleNodes ++ sampleNodesRemaining,
              currentRemainingUserNodes ++ userNodesRemaining
            )
          case FuzzyMatch(_, _, explanation: SolutionNodeMatchExplanation) =>
            (
              currentCertainMatches ++ newCertainMatches,
              (currentFuzzyMatches :+ FuzzyMatch(sampleNode, userNode, explanation)) ++ newFuzzyMatches,
              currentRemainingSampleNodes ++ sampleNodesRemaining,
              currentRemainingUserNodes ++ userNodesRemaining
            )
    }

    CompleteMatchingResult(
      newCertainRootMatches,
      newFuzzyRootMatches,
      sampleRootRemaining.map(_.node) ++ newSampleRemaining,
      userRootRemaining.map(_.node) ++ newUserRemaining
    )
  }

  def performMatching(sampleSolution: Seq[SolutionNode], userSolution: Seq[SolutionNode]): Seq[SolNodeMatch] = {

    val sampleSolutionNodes = sampleSolution map prepareNode
    val userSolutionNodes   = userSolution map prepareNode

    val sampleTree = SolutionNodeContainer.buildTree(sampleSolutionNodes)
    val userTree   = SolutionNodeContainer.buildTree(userSolutionNodes)

    matchContainerTrees(sampleTree, userTree).allMatches.map {
      case CertainMatch(sampleValue, userValue) => createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, None)
      case FuzzyMatch(sampleValue, userValue, explanation: SolutionNodeMatchExplanation) =>
        createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, Some(explanation))
    }

  }
