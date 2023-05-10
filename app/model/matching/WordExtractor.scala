package model.matching

object WordExtractor {

  private val wordRegex    = "\\p{L}{2,}".r
  private val ignoredRegex = "[,-]".r

  def extractWordsNew(text: String): Seq[String] = for {
    textPart <- text.replaceAll("/", " ").split("\\s+").toSeq

    word = ignoredRegex.replaceAllIn(textPart, "")

    result = word.toLowerCase if wordRegex.matches(word)
  } yield result

}
