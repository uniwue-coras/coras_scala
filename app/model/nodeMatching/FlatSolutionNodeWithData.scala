package model.nodeMatching

import model.paragraphMatching.ParagraphCitationLocation

final case class FlatSolutionNodeWithData(
  nodeId: Int,
  text: String,
  parentId: Option[Int],
  citedParagraphs: Seq[ParagraphCitationLocation],
  wordsWithRelatedWords: Seq[WordWithRelatedWords]
)
