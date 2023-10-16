package de.uniwue.ls6.corasEvaluator

import de.uniwue.ls6.model._
import de.uniwue.ls6.matching.FlatSolutionNodeMatcher

object NodeMatchingEvaluator {

  def evaluateNodeMatching(
    abbreviations: Map[String, String],
    relatedWordGroups: Seq[Seq[ExportedRelatedWord]],
    exercises: Seq[ExportedExercise]
  ) = for {
    ExportedExercise(_id, _title, _text, sampleSolutionNodes, userSolutions)                 <- exercises
    ExportedUserSolution(_username, userSolutionNodes, _correctionStatus, correctionSummary) <- userSolutions
  } {

    val matchingResult = FlatSolutionNodeMatcher.performMatching(sampleSolutionNodes, userSolutionNodes)

    println(_id + " :: " + _title)

    ???
  }

}
