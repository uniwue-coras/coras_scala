package de.uniwue.ls6.matching

final case class ParagraphCitation(
  from: Int,
  to: Int,
  paragraphType: String,
  lawCode: String,
  mentionedParagraphs: Map[String, Seq[String]]
)

object ParagraphCitation {
  def apply(from: Int, to: Int, paragraphType: String, lawCode: String, mentionedParagraphs: (String, Seq[String])*): ParagraphCitation =
    ParagraphCitation(from, to, paragraphType, lawCode, mentionedParagraphs.toMap)
}
