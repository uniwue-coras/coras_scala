package model.matching.paragraphMatching

import model.{ParagraphCitation, ParagraphCitationLocation}

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

  opaque type Res[T]      = (T, Int)
  opaque type MultiRes[T] = Res[Seq[T]]

  private val emptyMultiRes = (Seq.empty, 0)

  opaque type GreedyExtractor[T]      = String => Option[Res[T]]
  opaque type GreedyMultiExtractor[T] = String => MultiRes[T]

  private def recursiveCommaSeparatedGreedyExtractor[T](extractSingle: GreedyExtractor[T], offset: Int): GreedyMultiExtractor[T] = (s) => {

    @scala.annotation.tailrec
    def go(source: String, offset: Int = 0, acc: List[T] = List.empty): MultiRes[T] = extractSingle(source.substring(offset)) match
      case None => (acc, offset)
      case Some((extracted, newOffset)) =>
        source.substring(offset + newOffset) match
          case startsWithCommaRegex(comma) => go(source, offset + newOffset + comma.size, extracted :: acc)
          case _                           => emptyMultiRes

    go(s, offset)
  }

  opaque type Sentence = String

  private val startsWithSDotRegex          = """^(S\.?\s*).*$""".r
  private val startsWithArabicNumeralRegex = """^(\d+\s*)(.*)$""".r

  private val singleSentenceExtractor: GreedyExtractor[Sentence] =
    case startsWithArabicNumeralRegex(arabicNumeral, _) => Some((arabicNumeral, arabicNumeral.size))
    case _                                              => None

  private val newSentencesExtractor: GreedyMultiExtractor[Sentence] =
    case source @ startsWithSDotRegex(sDot) => recursiveCommaSeparatedGreedyExtractor(singleSentenceExtractor, sDot.size).apply(source)
    case _                                  => emptyMultiRes

  private def extractSentenceNumbersGreedyRecursive(source: String, offset: Int = 0): MultiRes[Sentence] = source.substring(offset) match
    case startsWithArabicNumeralRegex(arabicNumeral, newSource) =>
      val (otherSentences, offsetAfterOtherSentences) = newSource match
        case startsWithCommaRegex(comma) => extractSentenceNumbersGreedyRecursive(newSource, comma.size)
        case _                           => emptyMultiRes

      val sentence = arabicNumeral.trim()

      (sentence +: otherSentences, offset + arabicNumeral.size + offsetAfterOtherSentences)
    case _ => emptyMultiRes

  private val sentencesExtractor: GreedyMultiExtractor[Sentence] =
    case source @ startsWithSDotRegex(sentenceMatch) => extractSentenceNumbersGreedyRecursive(source, sentenceMatch.size)
    case _                                           => emptyMultiRes

  opaque type SubParagraph = String

  private val startsWithAbsDotRegex           = """^(Abs\.?\s*).*""".r
  private val startsWithRomanNumeralLikeRegex = """^([IVX]+\s*)(.*)$""".r

  private def extractArabicParagraphNumbersGreedyRecursive(source: String, offset: Int = 0): MultiRes[(SubParagraph, Seq[Sentence])] =
    source.substring(offset) match
      case startsWithArabicNumeralRegex(arabicNumeral, newSource) =>
        // try reading any sentences next
        val (sentences, offsetAfterSentences) = sentencesExtractor(newSource)
        val sourceAfterSentences              = newSource.substring(offsetAfterSentences)

        val (otherSubParagraphs, offsetAfterOtherParagraphs) = sourceAfterSentences match
          case startsWithCommaRegex(comma) => extractArabicParagraphNumbersGreedyRecursive(sourceAfterSentences, comma.size)
          case _                           => emptyMultiRes

        val subParagraph = arabicNumeral.trim()

        ((subParagraph, sentences) +: otherSubParagraphs, offset + arabicNumeral.size + offsetAfterSentences + offsetAfterOtherParagraphs)

      case _ => emptyMultiRes // TODO: "Abs." not followed by a arabic numeral, log!

  private val startsWithCommaRegex = """(,\s*).*""".r

  private def extractRomanParagraphNumbersGreedyRecursive(source: String, offset: Int = 0): MultiRes[(SubParagraph, Seq[Sentence])] =
    source.substring(offset) match
      case startsWithRomanNumeralLikeRegex(romanNumeralLike, newSource) =>
        // try reading any sentences next
        val (sentences, offsetAfterSentences) = sentencesExtractor(newSource)
        val sourceAfterSentences              = newSource.substring(offsetAfterSentences)

        // more roman numerals as subParagraphs after comma!
        val (otherSubParagraphs, offsetAfterOtherParagraphs) = sourceAfterSentences match
          case startsWithCommaRegex(comma) => extractRomanParagraphNumbersGreedyRecursive(sourceAfterSentences, comma.size)
          case _                           => (Seq.empty, 0)

        val subParagraph = romanNumeralConversions.getOrElse(romanNumeralLike.trim(), romanNumeralLike)

        ((subParagraph, sentences) +: otherSubParagraphs, offset + romanNumeralLike.size + offsetAfterSentences + offsetAfterOtherParagraphs)

      case _ => emptyMultiRes

  private val extractSubParagraphsGreedy: GreedyMultiExtractor[(SubParagraph, Seq[Sentence])] =
    case source @ startsWithAbsDotRegex(subParagraphMatch) => extractArabicParagraphNumbersGreedyRecursive(source, subParagraphMatch.size)
    case source                                            => extractRomanParagraphNumbersGreedyRecursive(source)

  private val startsWithParagraphRegex = """^(\d+[a-zA-Z]?\s*).*""".r

  // first thing should be a paragraph number
  def extractParagraphGreedy(source: String, paragraphType: String): MultiRes[ParagraphCitation] = source match
    case startsWithParagraphRegex(paragraphNumberMatch) =>
      // TODO: search for subparagraphs, sentences, numbers, etc. while next part doesn't look like law code...
      // next could be a *optional* subparagraph ...
      val paragraphNumber          = paragraphNumberMatch.toString().trim()
      val textAfterParagraphNumber = source.substring(paragraphNumberMatch.size)

      val (subParagraphs, offsetAfterSubParagraphs) = extractSubParagraphsGreedy(textAfterParagraphNumber)
      val textAfterSubParagraphs                    = textAfterParagraphNumber.substring(offsetAfterSubParagraphs)

      // TODO: sentences without subParagraph?

      // TODO: law code...

      val (lawCodeOffset, lawCode) = lawCodeRegex.findPrefixMatchOf(textAfterSubParagraphs) match
        case Some(lawCodeMatch) => (lawCodeMatch.end, Some(lawCodeMatch.toString()))
        case None =>
          println(textAfterSubParagraphs)
          (0, None)

      println("-----")

      val end = paragraphNumberMatch.size + offsetAfterSubParagraphs + lawCodeOffset

      val pcs = subParagraphs match
        case Seq() => Seq(ParagraphCitation(paragraphType, lawCode.getOrElse("TODO!"), paragraphNumber, None, rest = ""))
        case subParagraphs =>
          subParagraphs.flatMap {
            case (subParagraph, Seq()) => Seq(ParagraphCitation(paragraphType, lawCode.getOrElse("TODO!"), paragraphNumber, Some(subParagraph), rest = ""))
            case (subParagraph, sentences) =>
              sentences.map { sentence =>
                ParagraphCitation(paragraphType, lawCode.getOrElse("TODO!"), paragraphNumber, Some(subParagraph), Some(sentence), rest = "")
              }
          }

      (pcs, end)

    case _ => emptyMultiRes

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

        val (paragraphCitations, citationLength) = extractParagraphGreedy(textPart, paragraphType)

        ParagraphCitationLocation(currentMatch.start, currentMatch.end + citationLength, paragraphCitations)
      }

  }
