package de.uniwue.ls6.corasEvaluator

import model.SolutionNodeMatch
import model.matching.Matcher

object NodeMatchMatcher extends Matcher[SolutionNodeMatch, Nothing] {

  override protected def checkCertainMatch(left: SolutionNodeMatch, right: SolutionNodeMatch): Boolean =
    left.sampleNodeId == right.sampleNodeId && left.userNodeId == right.userNodeId

}
