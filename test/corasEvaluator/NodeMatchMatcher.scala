package de.uniwue.ls6.corasEvaluator

import model.ls6.matching.Matcher
import model.ls6.model.SolutionNodeMatch

object NodeMatchMatcher extends Matcher[SolutionNodeMatch, Double] {

  override protected val certaintyThreshold: Double = 1.0

  override protected def checkCertainMatch(left: SolutionNodeMatch, right: SolutionNodeMatch): Boolean =
    left.sampleNodeId == right.sampleNodeId && left.userNodeId == right.userNodeId

  override protected def generateFuzzyMatchExplanation(left: SolutionNodeMatch, right: SolutionNodeMatch): Double = 0.0

  override protected def fuzzyMatchingRate(explanation: Double): Double = explanation

}
