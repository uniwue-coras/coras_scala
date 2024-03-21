package model.matching.paragraphMatching

import model.{ParagraphCitation, ParagraphCitationLocation}

import scala.util.matching.Regex.{Match => RegexMatch}

import scala.language.implicitConversions

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

  // New extractor

  opaque type Res[T] = (T, Int)

  private val emptyMultiRes = (Seq.empty, 0)

  trait GreedyExtractor[T] extends (String => Option[Res[T]]):
    def ~[U](that: => GreedyExtractor[U]): GreedyExtractor[(T, U)] = source =>
      for {
        (thisResult, thisOffset) <- this.apply(source)
        (thatResult, thatOffset) <- that.apply(source.substring(thisOffset))
      } yield ((thisResult, thatResult), thisOffset + thatOffset)

    def <~[U](that: => GreedyExtractor[U]): GreedyExtractor[U] = source =>
      for {
        (_, thisOffset)          <- this.apply(source)
        (thatResult, thatOffset) <- that.apply(source.substring(thisOffset))
      } yield (thatResult, thisOffset + thatOffset)

    def * : GreedyExtractor[Seq[T]] = source => {
      @scala.annotation.tailrec
      def go(acc: Seq[T], offset: Int): Option[Res[Seq[T]]] = this.apply(source) match
        case None                               => Some((acc, offset))
        case Some((extracted, extractedLength)) => go(acc :+ extracted, offset + extractedLength)

      go(Seq.empty, 0)
    }

    def ^^[U](f: T => U): GreedyExtractor[U] = source =>
      for {
        (thisResult, thisOffset) <- this.apply(source)
      } yield (f(thisResult), thisOffset)

    def sepBy[U](that: => GreedyExtractor[U]): GreedyExtractor[Seq[T]] = this ~ (that <~ this).* ^^ { case (first, others) => first +: others }

  implicit def regex2Extractor(r: scala.util.matching.Regex): GreedyExtractor[String] = source =>
    r.findPrefixOf(source) map { prefix => (prefix.toString(), prefix.size) }

  @deprecated()
  opaque type GreedyMultiExtractor[T] = String => Res[Seq[T]]

  private val startsWithCommaRegex = """(,\s*).*""".r

  private val commaExtractor: GreedyExtractor[String] =
    case startsWithCommaRegex(commaMatch) => Some(commaMatch, commaMatch.size)
    case _                                => None

  private def recursiveCommaSeparatedGreedyExtractor[T](singleExtractor: GreedyExtractor[T]): GreedyMultiExtractor[T] = source => {

    def commaAndOtherExtractor = commaExtractor ~ singleExtractor

    @scala.annotation.tailrec
    def go(acc: Seq[T], offset: Int): Res[Seq[T]] = commaAndOtherExtractor.apply(source.substring(offset)) match
      case None                                  => (acc, offset)
      case Some((_, extracted), extractedLength) => go(acc :+ extracted, offset + extractedLength)

    // extract first
    singleExtractor(source) match
      case None                               => emptyMultiRes
      case Some((extracted, extractedLength)) => go(Seq(extracted), extractedLength)
  }

  opaque type Sentence = String

  private val startsWithSDotRegex          = """^(S\.?\s*).*$""".r
  private val startsWithArabicNumeralRegex = """^(\d+\s*)(.*)$""".r

  private val comma         = """,\s*""".r ^^ { _.trim() }
  private val arabicNumeral = """\d+\s*""".r ^^ { _.trim() }

  private val newSentencesExtractor: GreedyExtractor[Seq[Sentence]] =
    // TODO: try extracting sentences without leading "S."
    case source @ startsWithSDotRegex(sDot) => arabicNumeral.sepBy(comma).apply(source.substring(sDot.size))
    case _ => Some(emptyMultiRes)

  opaque type SubParagraph = String

  private val startsWithAbsDotRegex           = """^(Abs\.?\s*).*""".r
  private val startsWithRomanNumeralLikeRegex = """^([IVX]+\s*)(.*)$""".r

  private val singleArabicSubParagraphExtractor: GreedyExtractor[(SubParagraph, Seq[Sentence])] = arabicNumeral ~ newSentencesExtractor

  private val arabicParagraphsExtractor = singleArabicSubParagraphExtractor.sepBy(comma)

  private def extractArabicParagraphNumbersGreedyRecursive(source: String, offset: Int = 0): Res[Seq[(SubParagraph, Seq[Sentence])]] =
    source.substring(offset) match
      case startsWithArabicNumeralRegex(arabicNumeral, newSource) =>
        // try reading any sentences next
        val (sentences, offsetAfterSentences) = newSentencesExtractor(newSource).getOrElse(emptyMultiRes)
        val sourceAfterSentences              = newSource.substring(offsetAfterSentences)

        val (otherSubParagraphs, offsetAfterOtherParagraphs) = sourceAfterSentences match
          case startsWithCommaRegex(comma) => extractArabicParagraphNumbersGreedyRecursive(sourceAfterSentences, comma.size)
          case _                           => emptyMultiRes

        val subParagraph = arabicNumeral.trim()

        ((subParagraph, sentences) +: otherSubParagraphs, offset + arabicNumeral.size + offsetAfterSentences + offsetAfterOtherParagraphs)

      case _ => emptyMultiRes // TODO: "Abs." not followed by a arabic numeral, log!

  private def extractRomanParagraphNumbersGreedyRecursive(source: String, offset: Int = 0): Res[Seq[(SubParagraph, Seq[Sentence])]] =
    source.substring(offset) match
      case startsWithRomanNumeralLikeRegex(romanNumeralLike, newSource) =>
        // try reading any sentences next
        val (sentences, offsetAfterSentences) = newSentencesExtractor(newSource).getOrElse(emptyMultiRes)
        val sourceAfterSentences              = newSource.substring(offsetAfterSentences)

        // more roman numerals as subParagraphs after comma!
        val (otherSubParagraphs, offsetAfterOtherParagraphs) = sourceAfterSentences match
          case startsWithCommaRegex(comma) => extractRomanParagraphNumbersGreedyRecursive(sourceAfterSentences, comma.size)
          case _                           => (Seq.empty, 0)

        val subParagraph = romanNumeralConversions.getOrElse(romanNumeralLike.trim(), romanNumeralLike)

        ((subParagraph, sentences) +: otherSubParagraphs, offset + romanNumeralLike.size + offsetAfterSentences + offsetAfterOtherParagraphs)

      case _ => emptyMultiRes

  private val extractSubParagraphsGreedy: GreedyMultiExtractor[(SubParagraph, Seq[Sentence])] =
    case source @ startsWithAbsDotRegex(subParagraphMatch) => 
      val x: Option[Res[Seq[(SubParagraph, Seq[Sentence])]]] = arabicParagraphsExtractor.apply(source.substring(subParagraphMatch.size))
      extractArabicParagraphNumbersGreedyRecursive(source, subParagraphMatch.size)
    case source                                            => extractRomanParagraphNumbersGreedyRecursive(source)

  private val startsWithParagraphRegex = """^(\d+[a-zA-Z]?\s*).*""".r

  // first thing should be a paragraph number
  def extractParagraphGreedy(source: String, paragraphType: String): Res[Seq[ParagraphCitation]] = source match
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
