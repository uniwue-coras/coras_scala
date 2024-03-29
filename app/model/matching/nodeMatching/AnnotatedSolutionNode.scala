package model.matching.nodeMatching

import model.matching.wordMatching.WordWithRelatedWords
import model.{Applicability, ParagraphCitation, SolutionNode}

final case class AnnotatedSolutionNode(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  wordsWithRelatedWords: Seq[WordWithRelatedWords],
  citedParagraphs: Seq[ParagraphCitation]
) extends SolutionNode
