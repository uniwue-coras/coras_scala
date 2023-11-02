package de.uniwue.ls6.matching

import scala.util.matching.Regex

final case class ParagraphExtraction(from: Int, to: Int, paragraphType: String, lawCode: String, rest: String)

object ParagraphExtractor {

  private val extractorRegex = "(§§?|Art.?)(.*?)([BH]GB|LABV|GG|P[AO]G|((AG)?Vw)?GO|VwVfG)".r

  private val isolatedArabicNumbersRegex = """(\d[a-z]*) (\d)""".r

  private val romanNumerals = Seq(
    "I"     -> 1,
    "II"    -> 2,
    "III"   -> 3,
    "IV"    -> 4,
    "V"     -> 5,
    "VI"    -> 6,
    "VII"   -> 7,
    "VIII"  -> 8,
    "IX"    -> 9,
    "X"     -> 10,
    "XI"    -> 11,
    "XII"   -> 12,
    "XIII"  -> 13,
    "XIV"   -> 14,
    "XV"    -> 15,
    "XVI"   -> 16,
    "XVII"  -> 17,
    "XVIII" -> 18,
    "XIX"   -> 19,
    "XX"    -> 20
  ).map { case (roman, num) => (s"\\b$roman([a-z]*)\\b".r, num) }

  private[matching] def processRest(rest: String): Seq[String] = rest.split(",").toSeq.map { part =>
    // römische ziffern durch 'Abs. ...' ersetzen
    val restWithoutRoman = romanNumerals.foldLeft(part) { case (acc, (romanNumRegex, num)) =>
      romanNumRegex.replaceAllIn(acc, m => if (m.matched != "Var") s"Abs. $num${m.group(1)}" else { m.matched })
    }

    // vor isolierte arabische Ziffern 'S. ' einfügen
    val restWithSentence = isolatedArabicNumbersRegex.replaceAllIn(restWithoutRoman, m => s"${m.group(1)} S. ${m.group(2)}")

    restWithSentence.trim
  }

  private def convertMatch(aMatch: Regex.Match, offset: Int = 0): ParagraphExtraction = ParagraphExtraction(
    from = aMatch.start + offset,
    to = aMatch.end + offset,
    paragraphType = aMatch.group(1),
    rest = aMatch.group(2).trim,
    lawCode = aMatch.group(3).trim
  )

  def extractAndReplace(text: String): (String, Seq[ParagraphExtraction]) = {
    @scala.annotation.tailrec
    def go(currentText: String, removedCount: Int = 0, acc: Seq[ParagraphExtraction] = Seq.empty): (String, Seq[ParagraphExtraction]) =
      extractorRegex.findFirstMatchIn(currentText) match {
        case None => (currentText.trim, acc)
        case Some(regexMatch) =>
          go(
            currentText.substring(0, regexMatch.start) + " " + currentText.substring(regexMatch.end),
            removedCount + regexMatch.end - regexMatch.start - 1,
            acc :+ convertMatch(regexMatch, removedCount)
          )
      }

    go(text)
  }

  def extract(text: String): Seq[ParagraphExtraction] = for {
    aMatch <- extractorRegex.findAllMatchIn(text).toSeq
  } yield convertMatch(aMatch)

}
