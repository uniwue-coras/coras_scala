package de.uniwue.ls6.matching

final case class CitedParagraph()

final case class FlatSolutionNodeWithData(
  nodeId: Int,
  text: String,
  parentId: Option[Int],
  citedParagraphs: Seq[CitedParagraph],
  wordsWithRelatedWords: Seq[WordWithRelatedWords]
)
