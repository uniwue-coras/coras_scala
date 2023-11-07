package model.ls6.matching

object WordExtractor {

  private val wordRegex    = "\\p{L}{2,}".r
  private val ignoredRegex = "[,-]".r

  def normalizeWord(word: String): String = ignoredRegex.replaceAllIn(word, "")

  def extractWordsNew(text: String): Seq[String] = for {
    textPart <- text.replaceAll("/", " ").split("\\s+").toSeq
    word   = normalizeWord(textPart)
    result = word.toLowerCase if wordRegex.matches(word)
  } yield result

}
