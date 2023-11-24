package model.matching.nodeMatching

import model.matching.paragraphMatching.ParagraphCitationLocation
import model.matching.wordMatching.WordWithRelatedWords

final case class FlatSolutionNodeWithData(
  nodeId: Int,
  text: String,
  parentId: Option[Int],
  citedParagraphs: Seq[ParagraphCitationLocation],
  wordsWithRelatedWords: Seq[WordWithRelatedWords]
)
