package de.uniwue.ls6.corasEvaluator

import de.uniwue.ls6.model._
import de.uniwue.ls6.matching.FlatSolutionNodeMatcher
import de.uniwue.ls6.matching.TreeMatcher
import de.uniwue.ls6.matching.WordMatcher

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

object NodeMatchingEvaluator {

  def evaluateNodeMatching(
    abbreviations: Map[String, String],
    relatedWordGroups: Seq[Seq[ExportedRelatedWord]],
    exercises: Seq[ExportedExercise]
  ) = for {
    ExportedExercise(_id, _title, _text, sampleSolutionNodes, userSolutions)                              <- exercises
    ExportedUserSolution(_username, userSolutionNodes, nodeMatches, _correctionStatus, correctionSummary) <- userSolutions
  } {

    val foundNodeMatches = EvaluatorTreeMatcher.performMatching(sampleSolutionNodes, userSolutionNodes, abbreviations, relatedWordGroups)

    // TODO: compare matches!
    println(foundNodeMatches.length + " :: " + nodeMatches.length)

  }

}
