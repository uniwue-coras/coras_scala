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

  type WordMatchingResult = MatchingResult[ExtractedWord, Unit]

  private[correction] def extractWordsNew(text: String): Seq[ExtractedWord] = for {
    // TODO: remove non-char symbols like ",", "-", ...?
    (word, index) <- text
      .split("\\s+")
      .toSeq
      .zipWithIndex
  } yield ExtractedWord(index, word)

  def matchFromTexts(sampleText: String, userText: String): WordMatchingResult = performMatching(
    extractWordsNew(sampleText),
    extractWordsNew(userText)
  )

}
