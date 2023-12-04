package model.matching.nodeMatching

import model.SolutionNode
import model.matching.paragraphMatching.ParagraphCitation
import model.matching.wordMatching.WordWithRelatedWords

final case class FlatSolutionNodeWithData(
  node: SolutionNode,
  wordsWithRelatedWords: Seq[WordWithRelatedWords]
):

  def nodeId                     = node.id
  def text                       = node.text
  def parentId                   = node.parentId
  def paragraphCitationLocations = node.paragraphCitationLocations

  def citedParagraphs: Seq[ParagraphCitation] = paragraphCitationLocations.flatMap(_.citedParagraphs)
