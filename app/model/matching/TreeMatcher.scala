package model.matching

import de.uniwue.ls6.model.MatchStatus
import de.uniwue.ls6.matching.{Match, MatchingResult, WordExtractor}
import model._
import model.matching.WordMatcher.WordMatchingResult

final case class WordWithSynonymsAntonyms(word: String, synonyms: Seq[DbRelatedWord] = Seq.empty)

object TreeMatcher {

  private type Node = MatchedFlatSolutionNode

  private def performSameLevelMatching(
    sampleSolution: Seq[Node],
    userSolution: Seq[Node],
    currentParentIds: Option[(Int, Int)] = None
  ): MatchingResult[Node, WordMatchingResult] = {

    // Find root / child nodes
    val (sampleRootNodes, remainingSampleNodes) = sampleSolution.partition { _.solutionNode.parentId == currentParentIds.map(_._1) }
    val (userRootNodes, remainingUserNodes)     = userSolution.partition { _.solutionNode.parentId == currentParentIds.map(_._2) }

    val initialMatchingResult = NodeMatcher.performMatching(sampleRootNodes, userRootNodes)

    // perform child matching
    initialMatchingResult.matches.foldLeft(initialMatchingResult) { case (accMatchingResult, nodeMatch) =>
      MatchingResult.mergeMatchingResults(
        accMatchingResult,
        performSameLevelMatching(
          remainingSampleNodes,
          remainingUserNodes,
          Some(nodeMatch.sampleValue.solutionNode.id, nodeMatch.userValue.solutionNode.id)
        )
      )
    }
  }

  private def resolveSynonyms(
    text: String,
    abbreviations: Map[String, String],
    synonymAntonymBags: Seq[RelatedWordsGroup]
  ): Seq[WordWithSynonymsAntonyms] = for {
    word <- WordExtractor.extractWordsNew(text)

    realWord = abbreviations.getOrElse(word, word)

    synonymsAndAntonyms = synonymAntonymBags
      .flatMap { case RelatedWordsGroup(_, content) =>
        if (content.exists { _.word == realWord }) {
          // TODO: content (-> synonymsAndAntonyms) still contains realWord!
          Some(content)
        } else {
          None
        }
      }
      .headOption
      .getOrElse(Seq.empty)

    wordWithSynonyms = WordWithSynonymsAntonyms(realWord, synonymsAndAntonyms)
  } yield wordWithSynonyms

  def performMatching(
    username: String,
    exerciseId: Int,
    sampleSolution: Seq[IFlatSolutionNode],
    userSolution: Seq[IFlatSolutionNode],
    abbreviations: Map[String, String],
    synonymAntonymBags: Seq[RelatedWordsGroup]
  ): Seq[DbSolutionNodeMatch] = {
    val sampleSolutionNodes = sampleSolution.map { node => MatchedFlatSolutionNode(node, resolveSynonyms(node.text, abbreviations, synonymAntonymBags)) }
    val userSolutionNodes   = userSolution.map { node => MatchedFlatSolutionNode(node, resolveSynonyms(node.text, abbreviations, synonymAntonymBags)) }

    // TODO: match all...
    for {
      Match(sampleValue, userValue, certainty) <- performSameLevelMatching(sampleSolutionNodes, userSolutionNodes).matches
    } yield DbSolutionNodeMatch(username, exerciseId, sampleValue.solutionNode.id, userValue.solutionNode.id, MatchStatus.Automatic, certainty.map(_.rate))
  }

}
