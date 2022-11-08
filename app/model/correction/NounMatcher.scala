package model.correction

object NounMatcher extends CertainMatcher {

  override protected type T = ExtractedNoun

  private val nounRegex = "\\p{Lu}\\p{L}+".r

  private[correction] def newExtractNouns(text: String): Seq[ExtractedNoun] = for {
    w <- nounRegex.findAllMatchIn(text).toSeq
  } yield ExtractedNoun(w.start, w.end, w.matched)

  override protected def checkMatch(left: ExtractedNoun, right: ExtractedNoun): Boolean = left.matched == right.matched

  def matchFromTexts(sampleText: String, userText: String): MatchingResult[ExtractedNoun] = performMatching(
    newExtractNouns(sampleText),
    newExtractNouns(userText)
  )

}
