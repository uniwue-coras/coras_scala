package model.matching

import de.uniwue.ls6.matching.Matcher
import model.matching.WordMatcher.WordMatchingResult

// noinspection TypeAnnotation
private[matching] object NodeMatcher extends Matcher[MatchedFlatSolutionNode, WordMatchingResult] {

  override protected val checkCertainMatch             = (l, r) => l.solutionNode.text.trim == r.solutionNode.text.trim
  override protected val generateFuzzyMatchExplanation = (l, r) => WordMatcher.performMatching(l.wordsWithSynonyms, r.wordsWithSynonyms)
  override protected val fuzzyMatchingRate             = _.rate
  override protected val certaintyThreshold            = 0.2

}
