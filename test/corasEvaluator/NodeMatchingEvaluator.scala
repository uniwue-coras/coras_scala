package de.uniwue.ls6.corasEvaluator

import model.exporting.ExportedExercise
import model.nodeMatching.{FlatSolutionNodeMatchExplanation, TreeMatcher}
import model.{ExportedRelatedWord, MatchStatus, SolutionNodeMatch}

import scala.concurrent.{ExecutionContext, Future}

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
    maybeExplanation: Option[FlatSolutionNodeMatchExplanation]
  ): SolNodeMatch = EvaluatorSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, maybeExplanation.map(_.certainty))

}

final case class EvalResult(exerciseId: Int, username: String, truePos: Int, falseNeg: Int, falsePos: Int)

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
        val correctNodeMatches = sol.nodeMatches.filter { _.matchStatus != MatchStatus.Deleted }

        val foundNodeMatches = EvaluatorTreeMatcher.performMatching(ex.sampleSolutionNodes, sol.userSolutionNodes, abbreviations, relatedWordGroups)

        val result = NodeMatchMatcher.performMatching(correctNodeMatches, foundNodeMatches)

        EvalResult(ex.id, sol.username, truePos = result.matches.length, falseNeg = result.notMatchedSample.length, falsePos = result.notMatchedUser.length)
      }

    }

  }

}
