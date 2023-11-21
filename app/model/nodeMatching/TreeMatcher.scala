package model.nodeMatching

import model.matching.{Match, MatchingResult}
import model.paragraphMatching.ParagraphExtractor
import model.{MatchStatus, RelatedWord, SolutionNode, SolutionNodeMatch}
import model.wordMatching.WordWithRelatedWords

trait TreeMatcher {

  protected type SolNodeMatch <: SolutionNodeMatch

  private def performSameLevelMatching(
    sampleSolution: Seq[FlatSolutionNodeWithData],
    userSolution: Seq[FlatSolutionNodeWithData],
    currentParentIds: Option[(Int, Int)] = None
  ): FlatSolutionNodeMatcher.FlatSolutionNodeMatchingResult = {

    // Find root / child nodes
    val (sampleRootNodes, remainingSampleNodes) = sampleSolution.partition { _.parentId == currentParentIds.map(_._1) }
    val (userRootNodes, remainingUserNodes)     = userSolution.partition { _.parentId == currentParentIds.map(_._2) }

    val initialMatchingResult = FlatSolutionNodeMatcher.performMatching(sampleRootNodes, userRootNodes)

    // perform child matching
    initialMatchingResult.matches.foldLeft(initialMatchingResult) { case (accMatchingResult, nodeMatch) =>
      val childMatchingResult = performSameLevelMatching(
        remainingSampleNodes,
        remainingUserNodes,
        Some(nodeMatch.sampleValue.nodeId, nodeMatch.userValue.nodeId)
      )

      // TODO: perform "bucket" matching (if not last level)?

      MatchingResult.mergeMatchingResults(accMatchingResult, childMatchingResult)
    }
  }

  private def resolveSynonyms(
    text: String,
    abbreviations: Map[String, String],
    relatedWordGroups: Seq[Seq[RelatedWord]]
  ): Seq[WordWithRelatedWords] = for {
    word <- model.wordMatching.WordExtractor.extractWordsNew(text)

    realWord = abbreviations.getOrElse(word, word)

    (synonyms, antonyms) = relatedWordGroups
      .find { _.exists { _.word == realWord } }
      .getOrElse(Seq.empty)
      .filter { _.word != realWord }
      .partition { _.isPositive }

  } yield WordWithRelatedWords(realWord, synonyms.map(_.word), antonyms.map(_.word))

  private def prepareNode(node: SolutionNode, abbreviations: Map[String, String], relatedWordGroups: Seq[Seq[RelatedWord]]): FlatSolutionNodeWithData = {
    val (newText, extractedParagraphCitations) = ParagraphExtractor.extractAndReplace(node.text)

    val wordsWithRelatedWords = resolveSynonyms(newText, abbreviations, relatedWordGroups)

    FlatSolutionNodeWithData(node.id, node.text, node.parentId, extractedParagraphCitations, wordsWithRelatedWords)

  }

  protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    maybeExplanation: Option[FlatSolutionNodeMatchExplanation]
  ): SolNodeMatch

  def performMatching(
    sampleSolution: Seq[SolutionNode],
    userSolution: Seq[SolutionNode],
    abbreviations: Map[String, String],
    relatedWordGroups: Seq[Seq[RelatedWord]]
  ): Seq[SolNodeMatch] = {

    val sampleSolutionNodes = sampleSolution.map(n => prepareNode(n, abbreviations, relatedWordGroups))
    val userSolutionNodes   = userSolution.map(n => prepareNode(n, abbreviations, relatedWordGroups))

    val MatchingResult(sameLevelMatches, remainingSampleNodes, remainingUserNodes) = performSameLevelMatching(sampleSolutionNodes, userSolutionNodes)

    val sameLevelResultMatches = sameLevelMatches.map { case Match(sampleValue, userValue, explanation) =>
      createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, MatchStatus.Automatic, explanation)
    }

    /*
    // TODO: match all remaining...
    val MatchingResult(differentLevelMatches, _, _) = FlatSolutionNodeMatcher.performMatching(remainingSampleNodes, remainingUserNodes)

    val differentLevelResultMatches = differentLevelMatches.map { case Match(sampleValue, userValue, explanation) =>
      createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, MatchStatus.Automatic, explanation)
    }
     */

    sameLevelResultMatches /* ++ differentLevelResultMatches*/
  }

}
