package model.docxReading

final case class ParagraphExtraction(from: Int, to: Int, paragraphType: String, lawCode: String, rest: String)

object ParagraphExtractor {

  private val extractorRegex = "(§§?|Art.?)(.*?)([BH]GB|LABV|GG|P[AO]G|((AG)?Vw)?GO|VwVfG)".r

  private val isolatedArabicNumbersRegex = """(\d[a-z]*) (\d)""".r

  private val romanNumerals = Map(
    "I"    -> 1,
    "II"   -> 2,
    "III"  -> 3,
    "IV"   -> 4,
    "V"    -> 5,
    "VI"   -> 6,
    "VII"  -> 7,
    "VIII" -> 8,
    "IX"   -> 9,
    "X"    -> 10,
    "XI"   -> 11,
    "XII"  -> 12,
    "XIII" -> 13,
    "XIV"  -> 14,
    "XV"   -> 15
  )

  def processRest(rest: String): Seq[String] = for {
    part <- rest.split(',').toSeq

    // römische ziffern durch 'Abs. ...' ersetzen
    restWithoutRoman = romanNumerals.foldLeft(part) { case (acc, (roman, num)) =>
      val romanNumRegex = s" $roman([a-z]*)".r
      romanNumRegex.replaceAllIn(acc, m => if (m.matched == "Var") m.matched else s" Abs. $num${m.group(1)}")
    }

    // vor isolierte arabische Ziffern 'S. ' einfügen
    restWithSentence = isolatedArabicNumbersRegex.replaceAllIn(restWithoutRoman, m => s"${m.group(1)} S. ${m.group(2)}")

  } yield restWithSentence.trim

  def extract(text: String): Seq[ParagraphExtraction] = for {
    aMatch <- extractorRegex.findAllMatchIn(text).toSeq

    paragraphType = aMatch.group(1).trim
    rest          = aMatch.group(2).trim
    lawCode       = aMatch.group(3).trim

  } yield ParagraphExtraction(aMatch.start, aMatch.end, paragraphType, lawCode, rest)

}
