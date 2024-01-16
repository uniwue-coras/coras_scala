package model.matching.nodeMatching

import model.matching.paragraphMatching.{ParagraphCitation}
import model.matching.wordMatching.WordWithRelatedWords
import model.SolutionNode
import model.Applicability

final case class AnnotatedSolutionNode(
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  subTextNodes: Seq[AnnotatedSubTextNode],
  wordsWithRelatedWords: Seq[WordWithRelatedWords]
) extends SolutionNode:
  lazy val citedParagraphs: Seq[ParagraphCitation] = paragraphCitationLocations.flatMap(_.citedParagraphs)
