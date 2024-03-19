package model.matching.paragraphMatching

import model.{ParagraphCitation, ParagraphCitationLocation}

import scala.util.matching.Regex.{Match => RegexMatch}

object ParagraphExtractor:

  private val extractorRegex             = "(§§?|Art\\.?)(.*?)([BH]GB|LABV|GG|P[AO]G|((AG)?Vw)?GO|VwVfG|StPO|BV)".r
  private val isolatedArabicNumbersRegex = """(\d[a-z]*) (\d)""".r

  private val paragraphRegex    = """\s*(\d+[a-zA-Z]?)\s*""".r
  private val subParagraphRegex = """Abs.\s*(\d+)""".r

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

  extension [T](nums: Seq[T])
    def zipWithNext: Seq[(T, Option[T])] = for {
      (num, index) <- nums.zipWithIndex
      maybeNext = if index + 1 <= nums.size - 1 then Some(nums(index + 1)) else None
    } yield (num, maybeNext)

  extension (text: String)
    def replaceRomanNumeralsWithAbs: String = romanNumerals
      .foldLeft(text) { case (acc, (romanNumRegex, num)) =>
        romanNumRegex.replaceAllIn(acc, m => if m.matched != "Var" then s"Abs. $num${m.group(1)}" else m.matched)
      }
      .trim()

  private def preProcessRestPart(part: String): String = {
    // römische ziffern durch 'Abs. ...' ersetzen
    val restWithoutRoman = part.replaceRomanNumeralsWithAbs

    // vor isolierte arabische Ziffern 'S. ' einfügen
    val restWithSentence = isolatedArabicNumbersRegex.replaceAllIn(restWithoutRoman, m => s"${m.group(1)} S. ${m.group(2)}")

    restWithSentence.trim
  }

  private[paragraphMatching] def processRest(rest: String): Seq[(String, String)] = {
    val first :: others = rest
      .split(",")
      .map(preProcessRestPart)
      .toList: @unchecked // split can't be empty!

    paragraphRegex
      .findPrefixMatchOf(first)
      .map { firstParagraphNumberMatch =>
        var currentParagraphNumber = firstParagraphNumberMatch.group(1).trim

        val result = Seq(
          currentParagraphNumber -> first.substring(firstParagraphNumberMatch.end).trim
        )

        others.foldLeft(result) { (acc, currentPart) =>
          paragraphRegex.findPrefixMatchOf(currentPart) match {
            case None => acc :+ (currentParagraphNumber -> currentPart.trim)
            case Some(paragraphNumMatch) =>
              currentParagraphNumber = paragraphNumMatch.group(1)

              acc :+ (currentParagraphNumber -> currentPart.substring(paragraphNumMatch.end).trim)
          }
        }
      }
      .getOrElse(Seq.empty /* error condition! */ )
      .sortBy(_._1)
  }

  private def extractSectionNumberFromRest(rest: String): (Option[Int], String) = subParagraphRegex.findPrefixMatchOf(rest) match
    case None                     => (None, rest)
    case Some(sectionNumberMatch) => (Some(sectionNumberMatch.group(1).toInt), rest.substring(sectionNumberMatch.end).trim())

  private def convertMatch(aMatch: RegexMatch, offset: Int = 0): ParagraphCitationLocation = {
    val paragraphType = aMatch.group(1).trim
    val lawCode       = aMatch.group(3).trim

    val citedParagraphs = processRest(aMatch.group(2).trim).map { case (paragraphNumber, rest) =>
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

  // first thing should be a paragraph number
  def extractGreedy(source: String, paragraphType: String): (Seq[ParagraphCitation], Int) = paragraphRegex.findPrefixMatchOf(source) match
    case None                       => (Seq.empty, 0)
    case Some(paragraphNumberMatch) =>
      // TODO: search for subparagraphs, sentences, numbers, etc. while next part doesn't look like law code...
      // next could be a *optional* subparagraph ...
      val newText = source.substring(paragraphNumberMatch.end)

      val (offset, maybeSubParagraph) = subParagraphRegex.findPrefixMatchOf(newText) match
        case None                    => (0, None)
        case Some(subParagraphMatch) => (subParagraphMatch.end, Some(subParagraphMatch.group(1).toInt))

      val end = paragraphNumberMatch.end + offset

      val pc = ParagraphCitation(paragraphType, "TODO!", paragraphNumberMatch.toString(), maybeSubParagraph, "")

      (Seq(pc), end)

  private val paragraphCitationStartRegex = "(§|Art\\.?)".r

  def extractFrom(text: String): Seq[ParagraphCitationLocation] = {
    val cleanedText = text.replaceRomanNumeralsWithAbs.replaceAll("\u00a0", " ")

    paragraphCitationStartRegex
      .findAllMatchIn(cleanedText)
      .toSeq
      .zipWithNext
      .map { case (currentMatch, maybeNextMatch) =>
        val paragraphType = currentMatch.toString().trim()

        val lastEnd = maybeNextMatch
          .map { _.start }
          .getOrElse { cleanedText.size }

        val textPart = cleanedText
          .substring(currentMatch.end + 1, lastEnd)
          .trim()

        println(s">>$cleanedText<< ==> >>$textPart<<")

        val (paragraphCitations, citationLength) = extractGreedy(textPart, paragraphType)

        ParagraphCitationLocation(currentMatch.start, currentMatch.end + citationLength, paragraphCitations)
      }

  }
