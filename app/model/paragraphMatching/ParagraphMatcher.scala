package model.paragraphMatching

import model.matching.Matcher

object ParagraphMatcher extends Matcher[ParagraphCitation, Any] {

  override protected def checkCertainMatch(left: ParagraphCitation, right: ParagraphCitation): Boolean = ???

}
