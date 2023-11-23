package model.nodeMatching

import model.matching.Match
import model.paragraphMatching.ParagraphExtractor
import model.wordMatching.WordWithRelatedWords
import model.{MatchStatus, RelatedWord, SolutionNode, SolutionNodeMatch}

trait TreeMatcher[SolNodeMatch <: SolutionNodeMatch](abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]]):

  private def performSameLevelMatching(
    sampleSolution: Seq[FlatSolutionNodeWithData],
    userSolution: Seq[FlatSolutionNodeWithData],
    currentParentIds: Option[(Int, Int)] = None
  ): FlatSolutionNodeMatchingResult = {

    // Find root / child nodes
    val (sampleRootNodes, remainingSampleNodes) = sampleSolution.partition { _.parentId == currentParentIds.map(_._1) }
    val (userRootNodes, remainingUserNodes)     = userSolution.partition { _.parentId == currentParentIds.map(_._2) }

    val initialMatchingResult = FlatSolutionNodeMatcher.performMatching(sampleRootNodes, userRootNodes)

    // perform child matching
    initialMatchingResult.matches.foldLeft(initialMatchingResult) { case (accMatchingResult, nodeMatch) =>
      val childMatchingResult: FlatSolutionNodeMatchingResult = performSameLevelMatching(
        remainingSampleNodes,
        remainingUserNodes,
        Some(nodeMatch.sampleValue.nodeId, nodeMatch.userValue.nodeId)
      )

      // TODO: perform "bucket" matching (if not last level)?

      accMatchingResult + childMatchingResult
    }
  }

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
    maybeExplanation: Option[FlatSolutionNodeMatchExplanation]
  ): SolNodeMatch

  def performMatching(sampleSolution: Seq[SolutionNode], userSolution: Seq[SolutionNode]): Seq[SolNodeMatch] = {

    val sampleSolutionNodes = sampleSolution map prepareNode
    val userSolutionNodes   = userSolution map prepareNode

    val sampleTree = SolutionNodeContainer.buildTree(sampleSolutionNodes)
    val userTree   = SolutionNodeContainer.buildTree(userSolutionNodes)

    performSameLevelMatching(sampleSolutionNodes, userSolutionNodes).matches
      .map { case Match(sampleValue, userValue, explanation) =>
        createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, MatchStatus.Automatic, explanation)
      }
  }
