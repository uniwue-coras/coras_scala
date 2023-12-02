package model.matching.nodeMatching

import model.matching.paragraphMatching.ParagraphExtractor
import model.matching.wordMatching.WordWithRelatedWords
import model.matching.{CertainMatch, CompleteMatchingResult, FuzzyMatch}
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
    val rootMatchingResult: CompleteMatchingResult[SolutionNodeContainer, SolutionNodeMatchExplanation] =
      SolutionNodeContainerMatcher.performMatching(sampleTree, userTree)

    val CompleteMatchingResult(certainRootMatches, fuzzyRootMatches, sampleRootRemaining, userRootRemaining) = rootMatchingResult

    /*
    val newCertainRoots = rootMatchingResult.certainMatches.map {
      case CertainMatch(
            SolutionNodeContainer(sampleNode, sampleChildren),
            SolutionNodeContainer(userNode, userChildren)
          ) =>
        (CertainMatch(sampleNode, userNode), sampleChildren, userChildren)
    }

    val newFuzzyRoots = rootMatchingResult.fuzzyMatches.map {
      case FuzzyMatch(
            SolutionNodeContainer(sampleNode, sampleChildren),
            SolutionNodeContainer(userNode, userChildren),
            explanation
          ) =>
        (FuzzyMatch(sampleNode, userNode, explanation), sampleChildren, userChildren)
    }
     */

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

    val matchingResult = matchContainerTrees(sampleTree, userTree)

    val certainMatches = matchingResult.certainMatches.map { case CertainMatch(sampleValue, userValue) =>
      createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, None)
    }

    val fuzzyMatches = matchingResult.fuzzyMatches.map { case FuzzyMatch(sampleValue, userValue, explanation: SolutionNodeMatchExplanation) =>
      createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, Some(explanation))
    }

    certainMatches ++ fuzzyMatches

  }
