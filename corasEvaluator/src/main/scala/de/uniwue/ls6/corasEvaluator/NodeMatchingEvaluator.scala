package de.uniwue.ls6.corasEvaluator

import de.uniwue.ls6.model._
import de.uniwue.ls6.matching._

import scala.concurrent.{Future, ExecutionContext}

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
  )(implicit ec: ExecutionContext): Future[Seq[EvalResult]] = {

    val exesAndSols = for {
      exercise <- exercises
      userSol  <- exercise.userSolutions
    } yield (exercise, userSol)

    Future.traverse(exesAndSols) { case (ex, sol) =>
      Future {
        // remove deleted matches
        val notDeletedExportedNodeMatches = sol.nodeMatches.filter { _.matchStatus != MatchStatus.Deleted }

        val foundNodeMatches = EvaluatorTreeMatcher.performMatching(ex.sampleSolutionNodes, sol.userSolutionNodes, abbreviations, relatedWordGroups)

        val MatchingResult(correctMatches, notFoundMatches, wrongMatches) = NodeMatchMatcher.performMatching(notDeletedExportedNodeMatches, foundNodeMatches)

        EvalResult(ex.id, sol.username, correctMatches.length, notFoundMatches.length, wrongMatches.length)
      }

    }

  }

}
