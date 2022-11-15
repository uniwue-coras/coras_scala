package model.correction

final case class ExtractedWordNew(
  index: Int,
  word: String
)

object WordMatcher
    extends Matcher[ExtractedWordNew, Unit](
      checkCertainMatch = _.word == _.word,
      // FIXME: Fuzzy matching
      generateFuzzyMatchExplanation = (_, _) => (),
      fuzzyMatchingRate = _ => 0
    ) {

  type WordMatchingResult = MatchingResult[ExtractedWordNew, Unit]

  private[correction] def extractWordsNew(text: String): Seq[ExtractedWordNew] = for {
    // TODO: remove non-char symbols like ",", "-", ...?
    (word, index) <- text
      .split("\\s+")
      .toSeq
      .zipWithIndex
  } yield ExtractedWordNew(index, word)

  def matchFromTexts(sampleText: String, userText: String): WordMatchingResult = performMatching(
    extractWordsNew(sampleText),
    extractWordsNew(userText)
  )

}
