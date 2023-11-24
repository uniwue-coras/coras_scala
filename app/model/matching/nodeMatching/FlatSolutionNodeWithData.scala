package model.matching.nodeMatching

import model.matching.paragraphMatching.{ParagraphCitation, ParagraphCitationLocation}
import model.matching.wordMatching.WordWithRelatedWords

final case class FlatSolutionNodeWithData(
  nodeId: Int,
  text: String,
  parentId: Option[Int],
  paragraphCitationLocations: Seq[ParagraphCitationLocation],
  wordsWithRelatedWords: Seq[WordWithRelatedWords]
) {
  def citedParagraphs: Seq[ParagraphCitation] = paragraphCitationLocations.flatMap(_.citedParagraphs)
}
