package model.nodeMatching

import model.paragraphMatching.ParagraphCitationLocation
import model.wordMatching.WordWithRelatedWords

final case class FlatSolutionNodeWithData(
  nodeId: Int,
  text: String,
  parentId: Option[Int],
  citedParagraphs: Seq[ParagraphCitationLocation],
  wordsWithRelatedWords: Seq[WordWithRelatedWords]
)
