package model.correction

final case class ExtractedWord(
  start: Int,
  end: Int,
  matched: String
)

object NounMatcher extends Matcher[ExtractedWord] {

  override protected type E = Unit

  type NounMatchingResult = MatchingResult[ExtractedWord, Unit]

  private val wordRegex = "\\p{L}{3,}".r

  private[correction] def extractWords(text: String): Seq[ExtractedWord] = for {
    w <- wordRegex.findAllMatchIn(text).toSeq
  } yield ExtractedWord(w.start, w.end, w.matched)

  def matchFromTexts(sampleText: String, userText: String): NounMatchingResult = performCertainMatching(
    extractWords(sampleText),
    extractWords(userText)
  )

  // Certain matching

  override protected def checkMatch(left: ExtractedWord, right: ExtractedWord): Boolean = left.matched == right.matched

  // Fuzzy matching

  override protected def generateMatchExplanation(sampleValue: ExtractedWord, userValue: ExtractedWord): Unit = ???

  override protected def rate(e: Unit): Double = ???

}
