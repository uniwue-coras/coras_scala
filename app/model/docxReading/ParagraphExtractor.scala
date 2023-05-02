package model.docxReading

final case class ParagraphExtraction(from: Int, to: Int, paragraphType: String, lawCode: String, rest: String)

object ParagraphExtractor {

  private val extractorRegex = "(§§?|Art.?)(.*?)([BH]GB|LABV|GG|P[AO]G|((AG)?Vw)?GO|VwVfG)".r

  def extract(text: String): Seq[ParagraphExtraction] = for {
    aMatch <- extractorRegex.findAllMatchIn(text).toSeq

    paragraphType = aMatch.group(1).trim
    rest          = aMatch.group(2).trim
    lawCode       = aMatch.group(3).trim
  } yield ParagraphExtraction(aMatch.start, aMatch.end, paragraphType, lawCode, rest)

}
