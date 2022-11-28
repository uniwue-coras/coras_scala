package model.matching

import model.FlatSolutionNode
import model.matching.WordMatcher.WordMatchingResult

object NodeMatcher
    extends Matcher[FlatSolutionNode, WordMatchingResult](
      checkCertainMatch = _.text.trim == _.text.trim,
      generateFuzzyMatchExplanation = (l, r) => WordMatcher.matchFromTexts(l.text, r.text),
      fuzzyMatchingRate = _.rate
    )
