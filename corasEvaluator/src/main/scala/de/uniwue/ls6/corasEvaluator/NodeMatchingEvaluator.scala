package de.uniwue.ls6.corasEvaluator

import de.uniwue.ls6.model._
import de.uniwue.ls6.matching._

final case class EvaluatorSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  certainty: Option[Double]
) extends SolutionNodeMatch

object EvaluatorTreeMatcher extends TreeMatcher {

  override protected type SolNodeMatch = EvaluatorSolutionNodeMatch

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    certainty: Option[WordMatcher.WordMatchingResult]
  ): SolNodeMatch = EvaluatorSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, certainty.map(_.rate))

}

final case class EvalResult(exerciseId: Int, username: String, correct: Int, missing: Int, wrong: Int)

object NodeMatchingEvaluator {

  def evaluateNodeMatching(
    abbreviations: Map[String, String],
    relatedWordGroups: Seq[Seq[ExportedRelatedWord]],
    exercises: Seq[ExportedExercise]
  ): LazyList[EvalResult] = for {
    ExportedExercise(exerciseId, _, _, sampleSolutionNodes, userSolutions)       <- LazyList.from(exercises)
    ExportedUserSolution(username, userSolutionNodes, exportedNodeMatches, _, _) <- userSolutions

    // remove deleted matches
    notDeletedExportedNodeMatches = exportedNodeMatches.filter { _.matchStatus != MatchStatus.Deleted }

    foundNodeMatches = EvaluatorTreeMatcher.performMatching(sampleSolutionNodes, userSolutionNodes, abbreviations, relatedWordGroups)

    MatchingResult(correctMatches, notFoundMatches, wrongMatches) = NodeMatchMatcher.performMatching(notDeletedExportedNodeMatches, foundNodeMatches)

  } yield EvalResult(exerciseId, username, correctMatches.length, notFoundMatches.length, wrongMatches.length)

}
