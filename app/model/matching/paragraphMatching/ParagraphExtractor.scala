package model.matching.paragraphMatching

import model.{ParagraphCitation, ParagraphCitationLocation}

import scala.annotation.tailrec
import scala.language.implicitConversions
import scala.util.matching.Regex
import scala.util.matching.Regex.{Match => RegexMatch}

object ParagraphExtractor:

  private val extractorRegex             = "(§§?|Art\\.?)(.*?)([BH]GB|LABV|GG|P[AO]G|((AG)?Vw)?GO|VwVfG|StPO|BV)".r
  private val isolatedArabicNumbersRegex = """(\d[a-z]*) (\d)""".r

  private val paragraphRegex = """\s*(\d+[a-zA-Z]?)\s*""".r
  @deprecated()
  private val subParagraphRegex = """Abs.\s*(\d+)""".r

  private val lawCodeRegex = "[A-Z][a-zA-Z]+".r

  private val romanNumeralConversions = Map(
    "I"     -> "1",
    "II"    -> "2",
    "III"   -> "3",
    "IV"    -> "4",
    "V"     -> "5",
    "VI"    -> "6",
    "VII"   -> "7",
    "VIII"  -> "8",
    "IX"    -> "9",
    "X"     -> "10",
    "XI"    -> "11",
    "XII"   -> "12",
    "XIII"  -> "13",
    "XIV"   -> "14",
    "XV"    -> "15",
    "XVI"   -> "16",
    "XVII"  -> "17",
    "XVIII" -> "18",
    "XIX"   -> "19",
    "XX"    -> "20"
  )

  private val romanNumerals = romanNumeralConversions.map { case (roman, num) => (s"\\b$roman([a-z]*)\\b".r, num) }

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

  private def extractSectionNumberFromRest(rest: String): (Option[String], String) = subParagraphRegex.findPrefixMatchOf(rest) match
    case None                     => (None, rest)
    case Some(sectionNumberMatch) => (Some(sectionNumberMatch.group(1)), rest.substring(sectionNumberMatch.end).trim())

  private def convertMatch(aMatch: RegexMatch, offset: Int = 0): ParagraphCitationLocation = {
    val paragraphType = aMatch.group(1).trim
    val lawCode       = aMatch.group(3).trim

    val citedParagraphs = processRest(aMatch.group(2).trim).map { case (paragraphNumber, rest) =>
      val (maybeSectionNumber, newRest) = extractSectionNumberFromRest(rest)

      ParagraphCitation(paragraphType, lawCode, paragraphNumber, maybeSectionNumber, rest = newRest)
    }

    ParagraphCitationLocation(from = aMatch.start + offset, to = aMatch.end + offset, citedParagraphs)
  }

  def extractAndReplace(text: String): (String, Seq[ParagraphCitationLocation]) = {

    @tailrec
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

  // New extractor

  implicit def regex2Extractor(r: Regex): GreedyExtractor[String] = source => r.findPrefixOf(source) map { prefix => (prefix.toString().trim(), prefix.size) }

  opaque type Number       = String
  opaque type Sentence     = String
  opaque type SubParagraph = String
  opaque type Paragraph    = String
  opaque type LawCode      = String

  opaque type SentWithOptionalNum     = (Sentence, Option[Seq[Number]])
  opaque type SubParWithOptionalSents = (SubParagraph, Option[Seq[SentWithOptionalNum]])
  opaque type ParWithOptionalSubPars  = (Paragraph, Option[Seq[SubParWithOptionalSents]])

  private val comma         = """,\s*""".r
  private val arabicNumeral = """\d+\s*""".r
  private val romanNumber   = """[IVX]+\b\s*""".r ^^ { rml => romanNumeralConversions.getOrElse(rml, rml) }

  private val numbers = """Nr\.?\b\s*""".r <~ arabicNumeral.sepBy1(comma)

  // TODO: try extracting sentences without leading "S." ?
  private val sentence  = arabicNumeral ~ numbers.?
  private val sentences = """S\.?\s*""".r <~ sentence.sepBy1(comma) tapResult { sent => println(s"Ss >>$sent<<") }

  private val arabicSubParagraph = arabicNumeral ~ sentences.?
  private val romanSubParagraph  = romanNumber ~ sentences.?

  private val subParagraph: GreedyExtractor[Seq[SubParWithOptionalSents]] = GreedyExtractor.or(
    """Abs\.?\s*""".r <~ arabicSubParagraph.sepBy1(comma),
    romanSubParagraph.sepBy1(comma)
  ) tapResult { subPar => println(s"SP >>$subPar<<") }

  private val singleParagraph: GreedyExtractor[ParWithOptionalSubPars] = """\d+[a-zA-Z]?\s*""".r ~ subParagraph.? tapResult { par => println(s"P: >>$par<<") }

  private val citationRest: GreedyExtractor[((Seq[ParWithOptionalSubPars], String), LawCode)] = singleParagraph.sepBy1(comma) ~ """[\w\W]*?""".r ~ lawCodeRegex

  private def convertCitation(paragraphType: String, lawCode: LawCode, paragraphs: Seq[ParWithOptionalSubPars], rest: String) = paragraphs.flatMap {
    case (paragraph, None) => Seq(ParagraphCitation(paragraphType, lawCode, paragraph, rest = rest))
    case (paragraph, Some(subParagraphs)) =>
      subParagraphs.flatMap {
        case (subParagraph, None) => Seq(ParagraphCitation(paragraphType, lawCode, paragraph, Some(subParagraph), rest = rest))
        case (subParagraph, Some(sentences)) =>
          sentences.flatMap {
            case (sentence, None) => Seq(ParagraphCitation(paragraphType, lawCode, paragraph, Some(subParagraph), Some(sentence), rest = rest))
            case (sentence, Some(numbers)) =>
              numbers.map { number => ParagraphCitation(paragraphType, lawCode, paragraph, Some(subParagraph), Some(sentence), Some(number), rest = rest) }
          }
      }
  }

  private val paragraphCitationStartRegex = "(§|Art\\.?)".r

  def extractFrom(text: String): Seq[ParagraphCitationLocation] = {
    val cleanedText = text.replaceAll("\u00a0", " ")

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
          // TODO: can trim() break start & end values?
          .trim()

        println(s"TP: >>$textPart<<")

        val (((pars, rest), lawCode), citationLength) = citationRest.apply(textPart) match
          case None        => throw new Exception(s"Could not read >>$textPart<<")
          case Some(value) => value

        val paragraphCitations = convertCitation(paragraphType, lawCode, pars, rest)

        println("-----------")

        ParagraphCitationLocation(currentMatch.start, currentMatch.end + citationLength, paragraphCitations)
      }

  }
