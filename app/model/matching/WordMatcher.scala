package model.matching

import model.levenshtein.Levenshtein

final case class ExtractedWord(
  index: Int,
  word: String
)

final case class FuzzyWordMatchExplanation(
  distance: Int,
  maxLength: Int
)

object WordMatcher
    extends Matcher[ExtractedWord, FuzzyWordMatchExplanation](
      checkCertainMatch = _.word == _.word,
      generateFuzzyMatchExplanation = { case (ExtractedWord(_, left), ExtractedWord(_, right)) =>
        FuzzyWordMatchExplanation(
          distance = Levenshtein.distance(left, right),
          maxLength = Math.max(left.length, right.length)
        )
      },
      fuzzyMatchingRate = { case FuzzyWordMatchExplanation(distance, maxLength) => (maxLength - distance).toDouble / maxLength.toDouble },
      certaintyThreshold = 0.7
    ) {

  private val wordRegex    = "\\p{L}{3,}".r
  private val ignoredRegex = "[,-]".r

  type WordMatchingResult = MatchingResult[ExtractedWord, FuzzyWordMatchExplanation]

  private[matching] def extractWordsNew(text: String): Seq[ExtractedWord] = for {
    (word, index) <- text
      .replaceAll("/", " ")
      .split("\\s+")
      // TODO: remove non-char symbols like ",", "-", ...? -> not necessary anymore with fuzzy matching?
      .map { word => ignoredRegex.replaceAllIn(word, "") }
      .toSeq
      .zipWithIndex
      .filter { case (word, _) => wordRegex.matches(word) }

  } yield ExtractedWord(index, word.toLowerCase)

  def matchFromTexts(sampleText: String, userText: String): WordMatchingResult = performMatching(
    extractWordsNew(sampleText),
    extractWordsNew(userText)
  )

}
