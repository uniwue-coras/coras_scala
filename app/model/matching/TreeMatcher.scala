package model.matching

import model.matching.WordMatcher.WordMatchingResult
import model.{IFlatSolutionNode, MatchStatus, SolutionNodeMatch}

import scala.concurrent.{ExecutionContext, Future}

final case class WordWithSynonyms(
  word: String,
  synonyms: Seq[String] = Seq.empty
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
    futureGetSynonyms: String => Future[Seq[String]]
  )(implicit ec: ExecutionContext): Future[MatchedFlatSolutionNode] = for {
    synonyms <- Future.sequence {
      for {
        word <- WordExtractor.extractWordsNew(node.text)

        realWord = abbreviations.getOrElse(word, word)

        wordWithSynonym = for {
          synonyms <- futureGetSynonyms(realWord)
        } yield WordWithSynonyms(realWord, synonyms)

      } yield wordWithSynonym
    }

  } yield MatchedFlatSolutionNode(node, synonyms)

  def performMatching(
    username: String,
    exerciseId: Int,
    sampleSolution: Seq[IFlatSolutionNode],
    userSolution: Seq[IFlatSolutionNode],
    abbreviations: Map[String, String],
    futureGetSynonyms: String => Future[Seq[String]]
  )(implicit ec: ExecutionContext): Future[Seq[SolutionNodeMatch]] = for {
    sampleSolutionNodes <- Future.sequence {
      sampleSolution.map(annotateFlatSolutionNode(_, abbreviations, futureGetSynonyms))
    }
    userSolutionNodes <- Future.sequence {
      userSolution.map(annotateFlatSolutionNode(_, abbreviations, futureGetSynonyms))
    }

    // TODO: match all...
    matches = for {
      Match(sampleValue, userValue, certainty) <- performSameLevelMatching(sampleSolutionNodes, userSolutionNodes).matches
    } yield SolutionNodeMatch(username, exerciseId, sampleValue.solutionNode.id, userValue.solutionNode.id, MatchStatus.Automatic, certainty.map(_.rate))
  } yield matches

}
