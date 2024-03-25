package model.matching.paragraphMatching

import model.matching.paragraphMatching.GreedyExtractor.or
import model.{ParagraphCitation, ParagraphCitationLocation}

import scala.language.implicitConversions
import scala.util.matching.Regex

object ParagraphExtractor:
  given Conversion[Regex, GreedyExtractor[String]] = r => source => r.findPrefixOf(source) map { prefix => (prefix.toString().trim(), prefix.size) }

  extension (r: Regex)
    def extract[T](f: Regex.Match => T): GreedyExtractor[T] = source =>
      r.findPrefixMatchOf(source) map { prefixMatch => (f(prefixMatch), prefixMatch.end - prefixMatch.start) }

  extension [T](nums: Seq[T])
    def zipWithNext: Seq[(T, Option[T])] = for {
      (num, index) <- nums.zipWithIndex
      maybeNext = if index + 1 <= nums.size - 1 then Some(nums(index + 1)) else None
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

  opaque type Number       = String
  opaque type Sentence     = String
  opaque type SubParagraph = String
  opaque type Paragraph    = String
  opaque type LawCode      = String

  opaque type SentWithOptionalNum     = (Option[Sentence], Option[Number])
  opaque type SubParWithOptionalSents = (SubParagraph, Option[Seq[SentWithOptionalNum]])
  opaque type ParWithOptionalSubPars  = (Paragraph, Option[Seq[SubParWithOptionalSents]])

  private val nrDot = """Nr\.?\s*""".r
  private val sDot  = """S\.?\s*""".r

  private val abs           = """Abs\.?\s*""".r
  private val comma         = """,\s*""".r
  private val arabicNumeral = """\d+\s*""".r
  private val romanNumber   = """[IVX]+\b\s*""".r ^^ { rml => romanNumeralConversions.getOrElse(rml, rml) }

  private val alternative = """(Alt|Var)\.?\s*""".r <~ arabicNumeral.sepBy1(comma)

  private val number  = arabicNumeral ~ alternative
  private val numbers = nrDot <~ arabicNumeral.sepBy1(comma)

  private val sentence = arabicNumeral ~ numbers.?

  private val sentences = sDot.? <~ sentence.sepBy1(comma)

  // TODO: can go these ways: sent - sent num - num - num sent!
  private val paragraphEnd: GreedyExtractor[Seq[(Option[Sentence], Option[Number])]] = or(
    nrDot <~ arabicNumeral ^^ { num => (None, Some(num)) } sepBy1 (comma),
    sentences ^^ { sentences =>
      sentences.flatMap {
        case (sentence, None)          => Seq((Some(sentence), None))
        case (sentence, Some(numbers)) => numbers.map { number => (Some(sentence), Some(number)) }
      }
    }
  )

  private val arabicSubParagraph = abs.? <~ arabicNumeral ~ paragraphEnd.?
  private val romanSubParagraph  = romanNumber ~ paragraphEnd.?

  private val subParagraphs = or(
    abs <~ arabicSubParagraph.sepBy1(comma),
    romanSubParagraph.sepBy1(comma)
  )

  private val singleParagraph = """\d+[a-zA-Z]?\s*""".r ~ subParagraphs.?

  private val citationRest: GreedyExtractor[(Seq[ParWithOptionalSubPars], (String, LawCode))] =
    singleParagraph.sepBy1(comma) ~ """([\w\W]*?)([A-Z][a-zA-Z]+)""".r.extract { rm => (rm.group(1).trim(), rm.group(2).trim()) }

  private def convertCitation(paragraphType: String, lawCode: LawCode, paragraphs: Seq[ParWithOptionalSubPars]) = paragraphs.flatMap {
    case (paragraph, None) => Seq(ParagraphCitation(paragraphType, lawCode, paragraph))
    case (paragraph, Some(subParagraphs)) =>
      subParagraphs.flatMap {
        case (subParagraph, None) => Seq(ParagraphCitation(paragraphType, lawCode, paragraph, Some(subParagraph)))
        case (subParagraph, Some(sentences)) =>
          sentences.map { (sentence, num) => ParagraphCitation(paragraphType, lawCode, paragraph, Some(subParagraph), sentence, num) }
      }
  }

  private val paragraphCitationStartRegex = "(§§*|Art\\.)".r

  def extractAndRemove(text: String): (String, Seq[ParagraphCitationLocation]) = {

    val cleanedText = text.replaceAll("\u00a0", " ")

    val (endText, _, parCitLocs) = paragraphCitationStartRegex
      .findAllMatchIn(cleanedText)
      .toSeq
      .zipWithNext
      .foldLeft((cleanedText, 0, Seq[ParagraphCitationLocation]())) { case ((newText, upToNewRemovedCount, acc), (currentMatch, maybeNextMatch)) =>
        val paragraphType = currentMatch.toString().trim()

        val textPart = maybeNextMatch match
          case None            => cleanedText.substring(currentMatch.end).trim()
          case Some(nextMatch) => cleanedText.substring(currentMatch.end, nextMatch.start).trim()

        val ((pars, (rest, lawCode)), citationLength) = citationRest.apply(textPart) match
          case None        => throw new Exception(s"Could not read >>$textPart<<")
          case Some(value) => value

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
