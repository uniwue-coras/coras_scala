package de.uniwue.ls6.matching

import de.uniwue.ls6.model.{MatchStatus, RelatedWord, SolutionNode, SolutionNodeMatch}

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

    synonymsAndAntonyms = relatedWordGroups
      .find { _.exists { _.word == realWord } }
      .getOrElse(Seq.empty)
      .filter { _.word != realWord }

  } yield WordWithRelatedWords(realWord, synonymsAndAntonyms)

  def performMatching(
    sampleSolution: Seq[SolutionNode],
    userSolution: Seq[SolutionNode],
    abbreviations: Map[String, String],
    relatedWordGroups: Seq[Seq[RelatedWord]]
  ): Seq[SolNodeMatch] = {

    val sampleSolutionNodes = sampleSolution.map { node =>
      val wordsWithRelatedWords = resolveSynonyms(node.text, abbreviations, relatedWordGroups)

      val citedParagraphs = Seq.empty

      FlatSolutionNodeWithData(node.id, node.text, node.parentId, citedParagraphs, wordsWithRelatedWords)
    }
    val userSolutionNodes = userSolution.map { node =>
      val wordsWithRelatedWords = resolveSynonyms(node.text, abbreviations, relatedWordGroups)

      val citedParagraphs = Seq.empty

      FlatSolutionNodeWithData(node.id, node.text, node.parentId, citedParagraphs, wordsWithRelatedWords)
    }

    // TODO: match all...
    for {
      Match(sampleValue, userValue, certainty) <- performSameLevelMatching(sampleSolutionNodes, userSolutionNodes).matches
    } yield createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, MatchStatus.Automatic, certainty)
  }

}
