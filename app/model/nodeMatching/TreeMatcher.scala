package model.nodeMatching

import model.matching.Match
import model.paragraphMatching.ParagraphExtractor
import model.wordMatching.WordWithRelatedWords
import model.{MatchStatus, RelatedWord, SolutionNode, SolutionNodeMatch}
import model.matching.MatchingResult

private type InterimNodeMatch = Match[FlatSolutionNodeWithData, SolutionNodeMatchExplanation]

trait TreeMatcher[SolNodeMatch <: SolutionNodeMatch](abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]]):

  private def resolveSynonyms(text: String): Seq[WordWithRelatedWords] = for {
    word <- model.wordMatching.WordExtractor.extractWordsNew(text)

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
    matchStatus: MatchStatus,
    maybeExplanation: Option[SolutionNodeMatchExplanation]
  ): SolNodeMatch

  private val startTriple: (Seq[InterimNodeMatch], Seq[FlatSolutionNodeWithData], Seq[FlatSolutionNodeWithData]) = (Seq.empty, Seq.empty, Seq.empty)

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

        val MatchingResult(bucketMatches, sampleNodesRemaining, userNodesRemaining) =
          // TODO: use higher certaintyThreshold for bucket matching?
          FlatSolutionNodeMatcher(0.6).performMatching(sampleSubTreeRemaining, userSubTreeRemaining)

        // TODO: return triple of (InterimNodeMatch, Seq[FlatSolutionNodeWithData], Seq[FlatSolutionNodeWithData])

        val newMatches: Seq[InterimNodeMatch] = Match(sampleNode, userNode, explanation) +: (subTreeMatches ++ bucketMatches)

        (currentMatches ++ newMatches, currentRemainingSampleNodes ++ sampleNodesRemaining, currentRemainingUserNodes ++ userNodesRemaining)
    }

    MatchingResult(newRootMatches, sampleRootRemaining.map(_.node) ++ newSampleRemaining, userRootRemaining.map(_.node) ++ newUserRemaining)
  }

  def performMatching(sampleSolution: Seq[SolutionNode], userSolution: Seq[SolutionNode]): Seq[SolNodeMatch] = {

    val sampleSolutionNodes = sampleSolution map prepareNode
    val userSolutionNodes   = userSolution map prepareNode

    val sampleTree = SolutionNodeContainer.buildTree(sampleSolutionNodes)
    val userTree   = SolutionNodeContainer.buildTree(userSolutionNodes)

    matchContainerTrees(sampleTree, userTree).matches.map { case Match(sampleValue, userValue, explanation) =>
      createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, MatchStatus.Automatic, explanation)
    }

  }
