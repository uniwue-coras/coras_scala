package model.matching.paragraphMatching

import model.matching.paragraphMatching.GreedyExtractor.or
import model.{ParagraphCitation, ParagraphCitationLocation}
import play.api.Logger

import scala.language.implicitConversions
import scala.util.matching.Regex

object ParagraphExtractor {

  private val logger = Logger("ParagraphExtractor")

  // given Conversion[Regex, GreedyExtractor[String]] = r => source => r.findPrefixOf(source) map { prefix => (prefix.toString().trim(), prefix.size) }
  private implicit def regex2Extractor(r: Regex): GreedyExtractor[String] = source => r.findPrefixOf(source) map { prefix => (prefix.trim(), prefix.length) }

  private def extract[T](r: Regex, f: Regex.Match => T): GreedyExtractor[T] = source =>
    r.findPrefixMatchOf(source) map { prefixMatch => (f(prefixMatch), prefixMatch.end - prefixMatch.start) }

  /*
  extension (r: Regex)
    def extract[T](f: Regex.Match => T): GreedyExtractor[T] = source =>
      r.findPrefixMatchOf(source) map { prefixMatch => (f(prefixMatch), prefixMatch.end - prefixMatch.start) }
   */

  /*
  extension [T](nums: Seq[T])
    def zipWithNext: Seq[(T, Option[T])] = for {
      (num, index) <- nums.zipWithIndex
      maybeNext = if (index + 1 <= nums.size - 1) Some(nums(index + 1)) else None
    } yield (num, maybeNext)
   */

  private def zipWithNext[T](nums: Seq[T]): Seq[(T, Option[T])] = for {
    (num, index) <- nums.zipWithIndex
    maybeNext = if (index + 1 <= nums.size - 1) Some(nums(index + 1)) else None
  } yield (num, maybeNext)

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

  private type Alternative  = String
  private type Number       = String
  private type Sentence     = String
  private type SubParagraph = String
  private type Paragraph    = String
  private type LawCode      = String

  private type ParagraphCitationEnd    = (Option[Sentence], Option[Number], Option[Alternative])
  private type SubParWithOptionalSents = (SubParagraph, Option[Seq[ParagraphCitationEnd]])
  private type ParWithOptionalSubPars  = (Paragraph, Option[Seq[SubParWithOptionalSents]])

  private val comma = """,\s*""".r

  private val nrDot  = """Nr\.?\s*""".r
  private val sDot   = """S\.?\s*""".r
  private val absDot = """Abs\.?\s*""".r

  private val arabicNumeral = """\d+\s*""".r
  private val arabicDigit   = """\d(?!\d)[a-z]?\s*""".r

  private val romanNumber = extract(
    """([IVX]+)([a-z]?)\b\s*""".r,
    { romanNumberMatch =>
      val romNum = romanNumberMatch.group(1)
      val letter = romanNumberMatch.group(2)
      romanNumeralConversions.getOrElse(romNum, romNum) + letter
    }
  )

  // private val alternative = """(Alt|Var)\.?\s*""".r <~ arabicDigit.sepBy1(comma)

  private val numbers = nrDot <~ arabicDigit.sepBy1(comma)

  private val sentence = arabicDigit ~ numbers.?

  // TODO: can go either combination: sent * num * var!
  private val paragraphEnd: GreedyExtractor[Seq[ParagraphCitationEnd]] = or(
    sDot.? <~ sentence.sepBy1(comma) ^^ { sentences =>
      sentences.flatMap {
        case (sent, None)          => Seq((Some(sent), None, None))
        case (sent, Some(numbers)) => numbers.map { number => (Some(sent), Some(number), None) }
      }
    },
    nrDot <~ (arabicDigit.^^ { num => (None, Some(num), None) }.sepBy1(comma)),
    """(Alt|Var)\.?\s*""".r <~ arabicDigit ^^ { alt => (None, None, Some(alt)) } sepBy1 (comma)
  )

  private val arabicSubParagraph = absDot.? <~ arabicNumeral ~ paragraphEnd.?
  private val romanSubParagraph  = romanNumber ~ paragraphEnd.?

  private val subParagraphs: GreedyExtractor[Seq[(String, Option[Seq[ParagraphCitationEnd]])]] = or(
    absDot <~ arabicSubParagraph.sepBy1(comma),
    romanSubParagraph.sepBy1(comma)
  )

  private val singleParagraph = """\d+[a-zA-Z]?\s*""".r ~ subParagraphs.?

  private val citationRest: GreedyExtractor[(Seq[ParWithOptionalSubPars], (String, LawCode))] =
    singleParagraph.sepBy1(comma) ~ extract("""([\w\W]*?)([A-Z][a-zA-Z]+)""".r, { rm => (rm.group(1).trim(), rm.group(2).trim()) })

  private def convertCitation(paragraphType: String, lawCode: LawCode, paragraphs: Seq[ParWithOptionalSubPars]): Seq[ParagraphCitation] = paragraphs.flatMap {
    case (paragraph, None) => Seq(ParagraphCitation(paragraphType, lawCode, paragraph))
    case (paragraph, Some(subParagraphs)) =>
      subParagraphs.flatMap {
        case (subParagraph, None) => Seq(ParagraphCitation(paragraphType, lawCode, paragraph, Some(subParagraph)))
        case (subParagraph, Some(paragraphEnds)) =>
          paragraphEnds.map { case (sentence, num, alternative) =>
            ParagraphCitation(paragraphType, lawCode, paragraph, Some(subParagraph), sentence, num, alternative)
          }
      }
  }

  private val paragraphCitationStartRegex = "(§§*|Art\\.)".r

  def extractAndRemove(text: String): (String, Seq[ParagraphCitationLocation]) = {

    val cleanedText = text.replaceAll("\u00a0", " ") // \u00a0 = NO_BREAK_SPACE

    val (endText, _, parCitLocs) = zipWithNext(paragraphCitationStartRegex.findAllMatchIn(cleanedText).toSeq)
      .foldLeft((cleanedText, 0, Seq[ParagraphCitationLocation]())) { case ((newText, upToNewRemovedCount, acc), (currentMatch, maybeNextMatch)) =>
        val paragraphType = currentMatch.toString().trim()

        val textPart = maybeNextMatch match {
          case None            => cleanedText.substring(currentMatch.end).trim()
          case Some(nextMatch) => cleanedText.substring(currentMatch.end, nextMatch.start).trim()
        }

        val ((pars, (rest, lawCode)), citationLength) = citationRest.apply(textPart) match {
          case Some(value) => value
          case None =>
            logger.error(s"Could not read >>$textPart<<")
            ((Seq.empty, (textPart, "?")), 0)
        }

        val paragraphCitations = convertCitation(paragraphType, lawCode, pars)
          .sortBy(_.paragraph)

        val realEnd = currentMatch.end + citationLength

        val priorText = newText.substring(0, currentMatch.start - upToNewRemovedCount)
        val postText  = newText.substring(Math.min(newText.length(), realEnd - upToNewRemovedCount + 1))

        (
          priorText + postText,
          upToNewRemovedCount + realEnd - currentMatch.start,
          acc :+ ParagraphCitationLocation(currentMatch.start, realEnd, paragraphCitations, rest.trim())
        )
      }

    (endText, parCitLocs)
  }

  def extractFrom(text: String): Seq[ParagraphCitationLocation] = extractAndRemove(text)._2
}
