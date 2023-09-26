package de.uniwue.ls6.matching

import de.uniwue.ls6.matching.WordMatcher.WordMatchingResult
import de.uniwue.ls6.model.{MatchStatus, RelatedWord, SolutionNode, SolutionNodeMatch}

trait TreeMatcher {

  protected type SolNode <: SolutionNode
  protected type SolNodeMatch <: SolutionNodeMatch

  protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    certainty: Option[WordMatchingResult]
  ): SolNodeMatch

  private def performSameLevelMatching(
    sampleSolution: Seq[BaseFlatSolutionNode],
    userSolution: Seq[BaseFlatSolutionNode],
    currentParentIds: Option[(Int, Int)] = None
  ): MatchingResult[BaseFlatSolutionNode, WordMatchingResult] = {

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

    // TODO: content (-> synonymsAndAntonyms) still contains realWord!
    synonymsAndAntonyms = relatedWordGroups
      .find { _.exists { _.word == realWord } }
      .getOrElse(Seq.empty)

    wordWithSynonyms = WordWithRelatedWords(realWord, synonymsAndAntonyms)
  } yield wordWithSynonyms

  def performMatching(
    sampleSolution: Seq[SolNode],
    userSolution: Seq[SolNode],
    abbreviations: Map[String, String],
    relatedWordGroups: Seq[Seq[RelatedWord]]
  ): Seq[SolNodeMatch] = {

    val sampleSolutionNodes = sampleSolution.map { node =>
      BaseFlatSolutionNode(node.id, node.text, node.parentId, resolveSynonyms(node.text, abbreviations, relatedWordGroups))
    }
    val userSolutionNodes = userSolution.map { node =>
      BaseFlatSolutionNode(node.id, node.text, node.parentId, resolveSynonyms(node.text, abbreviations, relatedWordGroups))
    }

    // TODO: match all...
    for {
      Match(sampleValue, userValue, certainty) <- performSameLevelMatching(sampleSolutionNodes, userSolutionNodes).matches
    } yield createSolutionNodeMatch(sampleValue.nodeId, userValue.nodeId, MatchStatus.Automatic, certainty)
  }

}
