package model.correction

import model.FlatSolutionNode
import model.correction.NounMatcher.NounMatchingResult

object NodeMatcher extends Matcher[FlatSolutionNode] {

  override protected type E = NounMatchingResult

  // Certain matching

  override protected def checkMatch(left: FlatSolutionNode, right: FlatSolutionNode): Boolean = left.text.trim == right.text.trim

  // fuzzy matching

  override protected def rate(e: NounMatchingResult): Double = e.rate

  override protected def generateMatchExplanation(sampleValue: FlatSolutionNode, userValue: FlatSolutionNode): NounMatchingResult =
    NounMatcher.matchFromTexts(sampleValue.text, userValue.text)

}
