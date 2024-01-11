package corasEvaluator

import model.SolutionNodeMatchTrait
import model.matching.Matcher

object NodeMatchMatcher extends Matcher[SolutionNodeMatchTrait, Nothing]:
  override protected def checkCertainMatch(left: SolutionNodeMatchTrait, right: SolutionNodeMatchTrait): Boolean =
    left.sampleNodeId == right.sampleNodeId && left.userNodeId == right.userNodeId
