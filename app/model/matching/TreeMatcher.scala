package model.matching

import model.matching.WordMatcher.WordMatchingResult
import model.{IFlatSolutionNode, MatchStatus, SolutionNodeMatch}

import scala.concurrent.{ExecutionContext, Future}

// noinspection TypeAnnotation
private[matching] object NodeMatcher extends Matcher[MatchedFlatSolutionNode, WordMatchingResult] {

  override protected val checkCertainMatch             = (l, r) => l.solutionNode.text.trim == r.solutionNode.text.trim
  override protected val generateFuzzyMatchExplanation = (l, r) => WordMatcher.performMatching(l.wordsWithSynonyms, r.wordsWithSynonyms)
  override protected val fuzzyMatchingRate             = _.rate
  override protected val certaintyThreshold            = 0.2

}

final case class WordWithSynonyms(
  word: String,
  synonyms: Seq[String]
)

object TreeMatcher {

  private type T  = MatchedFlatSolutionNode
  private type MR = MatchingResult[T, WordMatchingResult]

  private def performSameLevelMatching(
    sampleSolution: Seq[T],
    userSolution: Seq[T],
    currentParentIds: Option[(Int, Int)] = None
  ): MR = {

    // Find root / child nodes
    val (sampleNodes, remainingSampleNodes) = sampleSolution.partition { _.solutionNode.parentId == currentParentIds.map(_._1) }
    val (userNodes, remainingUserNodes)     = userSolution.partition { _.solutionNode.parentId == currentParentIds.map(_._2) }

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
    futureGetSynonyms: String => Future[Seq[String]]
  )(implicit ec: ExecutionContext): Future[MatchedFlatSolutionNode] = for {
    synonyms <- Future.sequence {

      for {
        word <- WordExtractor.extractWordsNew(node.text)

        wordWithSynonym = for {
          synonyms <- futureGetSynonyms(word)
        } yield WordWithSynonyms(word, synonyms)

      } yield wordWithSynonym
    }

  } yield MatchedFlatSolutionNode(node, synonyms)

  def performMatching(
    username: String,
    exerciseId: Int,
    sampleSolution: Seq[IFlatSolutionNode],
    userSolution: Seq[IFlatSolutionNode],
    getSynonyms: String => Future[Seq[String]]
  )(implicit ec: ExecutionContext): Future[Seq[SolutionNodeMatch]] = for {
    sampleSolutionNodes <- Future.sequence { sampleSolution.map(annotateFlatSolutionNode(_, getSynonyms)) }
    userSolutionNodes   <- Future.sequence { userSolution.map(annotateFlatSolutionNode(_, getSynonyms)) }

    // TODO: match all...
    matches = for {
      Match(sampleValue, userValue, certainty) <- performSameLevelMatching(sampleSolutionNodes, userSolutionNodes).matches
    } yield SolutionNodeMatch(username, exerciseId, sampleValue.solutionNode.id, userValue.solutionNode.id, MatchStatus.Automatic, certainty.map(_.rate))
  } yield matches

}
