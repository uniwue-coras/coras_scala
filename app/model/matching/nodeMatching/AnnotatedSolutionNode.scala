package model.matching.nodeMatching

import model.matching.paragraphMatching.ParagraphCitation
import model.matching.wordMatching.WordWithRelatedWords

final case class AnnotatedSolutionNode(
  id: Int,
  text: String,
  isSubText: Boolean,
  parentId: Option[Int],
  citedParagraphs: Seq[ParagraphCitation],
  wordsWithRelatedWords: Seq[WordWithRelatedWords]
)
