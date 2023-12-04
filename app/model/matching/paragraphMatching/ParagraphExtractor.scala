package model.matching.paragraphMatching

import scala.util.matching.Regex.{Match => RegexMatch}

object ParagraphExtractor {

  private val extractorRegex             = "(§§?|Art.?)(.*?)([BH]GB|LABV|GG|P[AO]G|((AG)?Vw)?GO|VwVfG|StPO)".r
  private val isolatedArabicNumbersRegex = """(\d[a-z]*) (\d)""".r
  private val paragraphNumberRegex       = """\s*(\d+)""".r
  private val sectionNumberRegex         = """Abs.\s*(\d+)""".r

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

  private def preProcessRestPart(part: String): String = {
    // römische ziffern durch 'Abs. ...' ersetzen
    val restWithoutRoman = romanNumerals.foldLeft(part) { case (acc, (romanNumRegex, num)) =>
      romanNumRegex.replaceAllIn(acc, m => if (m.matched != "Var") s"Abs. $num${m.group(1)}" else { m.matched })
    }

    // vor isolierte arabische Ziffern 'S. ' einfügen
    val restWithSentence = isolatedArabicNumbersRegex.replaceAllIn(restWithoutRoman, m => s"${m.group(1)} S. ${m.group(2)}")

    restWithSentence.trim
  }

  private[paragraphMatching] def processRest(rest: String): Seq[CitedParag] = {
    val first :: others = rest
      .split(",")
      .map(preProcessRestPart)
      .toList: @unchecked // split can't be empty!

    paragraphNumberRegex
      .findPrefixMatchOf(first)
      .map { firstParagraphNumberMatch =>
        var currentParagraphNumber = firstParagraphNumberMatch.group(1).toInt

        val result = Seq[CitedParag](
          currentParagraphNumber -> first.substring(firstParagraphNumberMatch.end).trim
        )

        others.foldLeft(result) { (acc, currentPart) =>
          paragraphNumberRegex.findPrefixMatchOf(currentPart) match {
            case None => acc :+ (currentParagraphNumber -> currentPart.trim)
            case Some(paragraphNumMatch) =>
              currentParagraphNumber = paragraphNumMatch.group(1).toInt

              acc :+ (currentParagraphNumber -> currentPart.substring(paragraphNumMatch.end).trim)
          }
        }
      }
      .getOrElse(Seq.empty /* error condition! */ )
      .sortBy(_._1)
  }

  private def extractSectionNumberFromRest(rest: String): (Option[Int], String) = sectionNumberRegex.findPrefixMatchOf(rest) match
    case None                     => (None, rest)
    case Some(sectionNumberMatch) => (Some(sectionNumberMatch.group(1).toInt), rest.substring(sectionNumberMatch.end).trim())

  private def convertMatch(aMatch: RegexMatch, offset: Int = 0): ParagraphCitationLocation = {
    val paragraphType = aMatch.group(1).trim
    val lawCode       = aMatch.group(3).trim

    val citedParagraphs = processRest(aMatch.group(2).trim).map { case (paragraphNumber, rest) =>
      // TODO: extract section numbers!

      val (maybeSectionNumber, newRest) = extractSectionNumberFromRest(rest)

      ParagraphCitation(paragraphType, lawCode, paragraphNumber, maybeSectionNumber, newRest)
    }

    ParagraphCitationLocation(from = aMatch.start + offset, to = aMatch.end + offset, citedParagraphs)
  }

  def extractAndReplace(text: String): (String, Seq[ParagraphCitationLocation]) = {
    @scala.annotation.tailrec
    def go(currentText: String, removedCount: Int = 0, acc: Seq[ParagraphCitationLocation] = Seq.empty): (String, Seq[ParagraphCitationLocation]) =
      extractorRegex.findFirstMatchIn(currentText) match {
        case None => (currentText.trim, acc)
        case Some(regexMatch) =>
          go(
            currentText.substring(0, regexMatch.start) + " " + currentText.substring(regexMatch.end),
            removedCount + regexMatch.end - regexMatch.start - 1,
            acc :+ convertMatch(regexMatch, removedCount)
          )
      }

    go(text.replaceAll("\u00a0", " "))
  }

  def extractFrom(text: String): Seq[ParagraphCitationLocation] = for {
    aMatch <- extractorRegex.findAllMatchIn(text.replaceAll("\u00a0", " ")).toSeq
  } yield convertMatch(aMatch)

}
