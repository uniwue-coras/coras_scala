package model.matching

import model._
import model.matching.WordMatcher.WordMatchingResult

final case class WordWithSynonymsAntonyms(
  word: String,
  synonyms: Seq[RelatedWord] = Seq.empty
)

object TreeMatcher {

  private type T  = MatchedFlatSolutionNode
  private type MR = MatchingResult[T, WordMatchingResult]

  private def performSameLevelMatching(sampleSolution: Seq[T], userSolution: Seq[T], currentParentIds: Option[(Int, Int)] = None): MR = {

    // Find root / child nodes
    val (sampleNodes, remainingSampleNodes) = sampleSolution.partition {
      _.solutionNode.parentId == currentParentIds.map(_._1)
    }
    val (userNodes, remainingUserNodes) = userSolution.partition {
      _.solutionNode.parentId == currentParentIds.map(_._2)
    }

    val initialMatchingResult = NodeMatcher.performMatching(sampleNodes, userNodes)

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

  private def annotateFlatSolutionNode(
    node: IFlatSolutionNode,
    abbreviations: Map[String, String],
    synonymAntonymBags: Seq[RelatedWordsGroup]
  ): MatchedFlatSolutionNode = {
    val synonyms = for {
      word <- WordExtractor.extractWordsNew(node.text)

      realWord = abbreviations.getOrElse(word, word)

      // TODO: can word be in multiple synonymAntonymBags => better not...?
      synonymsAndAntonyms = synonymAntonymBags
        .flatMap { case RelatedWordsGroup(_, content) =>
          if (content.exists { _.word == realWord }) {
            Some(content)
          } else {
            None
          }
        }
        .headOption
        .getOrElse(Seq.empty)

      wordWithSynonyms = WordWithSynonymsAntonyms(realWord, synonymsAndAntonyms)

    } yield wordWithSynonyms

    MatchedFlatSolutionNode(node, synonyms)
  }

  def performMatching(
    username: String,
    exerciseId: Int,
    sampleSolution: Seq[IFlatSolutionNode],
    userSolution: Seq[IFlatSolutionNode],
    abbreviations: Map[String, String],
    synonymAntonymBags: Seq[RelatedWordsGroup]
  ): Seq[SolutionNodeMatch] = {
    val sampleSolutionNodes = sampleSolution.map(annotateFlatSolutionNode(_, abbreviations, synonymAntonymBags))
    val userSolutionNodes   = userSolution.map(annotateFlatSolutionNode(_, abbreviations, synonymAntonymBags))

    // TODO: match all...
    for {
      Match(sampleValue, userValue, certainty) <- performSameLevelMatching(sampleSolutionNodes, userSolutionNodes).matches
    } yield SolutionNodeMatch(username, exerciseId, sampleValue.solutionNode.id, userValue.solutionNode.id, MatchStatus.Automatic, certainty.map(_.rate))
  }

}
