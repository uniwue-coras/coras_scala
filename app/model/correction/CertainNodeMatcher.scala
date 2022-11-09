package model.correction

import model.FlatSolutionNode
import model.correction.CertainNounMatcher.NounMatchingResult

object CertainNodeMatcher extends CertainMatcher {

  override protected type T = FlatSolutionNode
  override protected type E = NounMatchingResult

  override protected def checkMatch(left: FlatSolutionNode, right: FlatSolutionNode): Boolean = left.text.trim == right.text.trim

}
