package de.uniwue.ls6.matching

final case class FlatSolutionNodeWithData(
  nodeId: Int,
  text: String,
  parentId: Option[Int],
  citedParagraphs: Seq[ParagraphCitation],
  wordsWithRelatedWords: Seq[WordWithRelatedWords]
)
