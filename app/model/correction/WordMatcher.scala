package model.correction

final case class ExtractedWord(
  index: Int,
  word: String
)

object WordMatcher
    extends Matcher[ExtractedWord, Unit](
      checkCertainMatch = _.word == _.word,
      // FIXME: Fuzzy matching
      generateFuzzyMatchExplanation = (_, _) => (),
      fuzzyMatchingRate = _ => 0
    ) {

  private val wordRegex    = "\\p{L}{3,}".r
  private val ignoredRegex = ","

  type WordMatchingResult = MatchingResult[ExtractedWord, Unit]

  private[correction] def extractWordsNew(text: String): Seq[ExtractedWord] = for {
    // TODO: remove non-char symbols like ",", "-", ...?
    (word, index) <- text
      .split("\\s+")
      // TODO: not necessary anymore with fuzzy matching?
      .map { _.replaceAll(ignoredRegex, "") }
      .toSeq
      .zipWithIndex
      .filter { case (word, _) => wordRegex.matches(word) }
  } yield ExtractedWord(index, word.toLowerCase)

  def matchFromTexts(sampleText: String, userText: String): WordMatchingResult = performMatching(
    extractWordsNew(sampleText),
    extractWordsNew(userText)
  )

}
