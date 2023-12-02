package corasEvaluator

import model.SolutionNodeMatch
import model.matching.CertainMatcher

object NodeMatchMatcher extends CertainMatcher[SolutionNodeMatch]:
  override protected def checkCertainMatch(left: SolutionNodeMatch, right: SolutionNodeMatch): Boolean =
    left.sampleNodeId == right.sampleNodeId && left.userNodeId == right.userNodeId
