package model.correction

object CertainNounMatcher extends CertainMatcher {

  override protected type T = ExtractedNoun
  override protected type E = Unit

  type NounMatchingResult = MatchingResult[ExtractedNoun, Unit]

  override protected def checkMatch(left: ExtractedNoun, right: ExtractedNoun): Boolean = left.matched == right.matched

  private val nounRegex = "\\p{Lu}\\p{L}+".r

  private[correction] def extractNouns(text: String): Seq[ExtractedNoun] = for {
    w <- nounRegex.findAllMatchIn(text).toSeq
  } yield ExtractedNoun(w.start, w.end, w.matched)

  def matchFromTexts(sampleText: String, userText: String): NounMatchingResult = performMatching(
    extractNouns(sampleText),
    extractNouns(userText)
  )

}
