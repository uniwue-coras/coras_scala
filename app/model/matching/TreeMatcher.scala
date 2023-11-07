package model.matching

import model.enums.MatchStatus
import model.{RelatedWord, SolutionNode, SolutionNodeMatch}

trait TreeMatcher {

  protected type SolNodeMatch <: SolutionNodeMatch

  protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    certainty: Option[WordMatcher.WordMatchingResult]
  ): SolNodeMatch

  private def performSameLevelMatching(
    sampleSolution: Seq[FlatSolutionNodeWithData],
    userSolution: Seq[FlatSolutionNodeWithData],
    currentParentIds: Option[(Int, Int)] = None
  ): MatchingResult[FlatSolutionNodeWithData, WordMatcher.WordMatchingResult] = {

    // Find root / child nodes
    val (sampleRootNodes, remainingSampleNodes) = sampleSolution.partition { _.parentId == currentParentIds.map(_._1) }
    val (userRootNodes, remainingUserNodes)     = userSolution.partition { _.parentId == currentParentIds.map(_._2) }

    val initialMatchingResult = FlatSolutionNodeMatcher.performMatching(sampleRootNodes, userRootNodes)

    // perform child matching
    initialMatchingResult.matches.foldLeft(initialMatchingResult) { case (accMatchingResult, nodeMatch) =>
      MatchingResult.mergeMatchingResults(
        accMatchingResult,
        performSameLevelMatching(
          remainingSampleNodes,
          remainingUserNodes,
          Some(nodeMatch.sampleValue.nodeId, nodeMatch.userValue.nodeId)
        )
      )
    }
  }

  private def resolveSynonyms(
    text: String,
    abbreviations: Map[String, String],
    relatedWordGroups: Seq[Seq[RelatedWord]]
  ): Seq[WordWithRelatedWords] = for {
    word <- WordExtractor.extractWordsNew(text)

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

  def performMatching(
    sampleSolution: Seq[SolutionNode],
    userSolution: Seq[SolutionNode],
    abbreviations: Map[String, String],
    relatedWordGroups: Seq[Seq[RelatedWord]]
  ): Seq[SolNodeMatch] = {

    val sampleSolutionNodes = sampleSolution.map(n => prepareNode(n, abbreviations, relatedWordGroups))
    val userSolutionNodes   = userSolution.map(n => prepareNode(n, abbreviations, relatedWordGroups))

    // TODO: match all...
    for {
      Match(sampleValue, userValue, certainty) <- performSameLevelMatching(sampleSolutionNodes, userSolutionNodes).matches
    } yield createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, MatchStatus.Automatic, certainty)
  }

}
