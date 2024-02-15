package model.matching.nodeMatching

import model.Applicability
import model.matching.paragraphMatching.ParagraphCitation
import model.matching.wordMatching.WordWithRelatedWords

final case class AnnotatedSolutionNode(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  wordsWithRelatedWords: Seq[WordWithRelatedWords],
  citedParagraphs: Seq[ParagraphCitation]
)
