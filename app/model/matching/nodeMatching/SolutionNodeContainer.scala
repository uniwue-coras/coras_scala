package model.matching.nodeMatching

import model._
import model.matching.paragraphMatching.ParagraphExtractor
import model.matching.wordMatching.WordAnnotator

final case class SolutionNodeContainer(
  node: AnnotatedSolutionNode,
  children: Seq[SolutionNodeContainer]
) {
  def id                         = node.id
  def text                       = node.text
  def parentId                   = node.parentId
  def subTextNodes               = node.subTextNodes
  def paragraphCitationLocations = node.paragraphCitationLocations
  def wordsWithRelatedWords      = node.wordsWithRelatedWords
}

class SolutionNodeContainerTreeBuilder(wordAnnotator: WordAnnotator):

  private def buildChildren(
    parentId: Option[Int],
    remainingNodes: Seq[SolutionNode],
    remainingSubTexts: Seq[AnnotatedSubTextNode]
  ): (Seq[SolutionNodeContainer], Seq[SolutionNode], Seq[AnnotatedSubTextNode]) = {
    // find children...
    val (childrenForCurrent, otherRemainingNodes) = remainingNodes.partition { _.parentId == parentId }

    childrenForCurrent.foldLeft((Seq[SolutionNodeContainer](), otherRemainingNodes, remainingSubTexts)) {
      case ((acc, remainingNodes, remainingSubTexts), current) =>
        val (ownSubTexts, otherRemainingSubTexNodes) = remainingSubTexts.partition(_.nodeId == current.id)

        val (children, newRemainingNodes, newRemainingSubTexNodes) = buildChildren(Some(current.id), remainingNodes, otherRemainingSubTexNodes)

        val (newText, extractedParagraphCitations) = ParagraphExtractor.extractAndReplace(current.text)

        val nodeWithData = AnnotatedSolutionNode(
          id = current.id,
          childIndex = current.childIndex,
          text = current.text,
          applicability = current.applicability,
          parentId = current.parentId,
          subTextNodes = ownSubTexts,
          wordsWithRelatedWords = wordAnnotator.resolveSynonyms(newText)
        )

        (acc :+ SolutionNodeContainer(nodeWithData, children), newRemainingNodes, newRemainingSubTexNodes)
    }
  }

  def buildSolutionTree(nodes: Seq[SolutionNode], subTexts: Seq[SubTextNode]) = {
    val annotatedSubTextNodes = subTexts.map { subTextNode =>
      AnnotatedSubTextNode(subTextNode.nodeId, subTextNode.id, subTextNode.text, subTextNode.applicability, wordAnnotator.resolveSynonyms(subTextNode.text))
    }

    val (result, remainingNodes, remainingSubTexts) = buildChildren(None, nodes, annotatedSubTextNodes)

    assert(remainingNodes.isEmpty)
    assert(remainingSubTexts.isEmpty)

    result
  }
