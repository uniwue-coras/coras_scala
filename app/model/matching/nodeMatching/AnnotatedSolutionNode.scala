package model.matching.nodeMatching

import model.matching.WordAnnotator
import model.matching.paragraphMatching.{ParagraphCitation, ParagraphExtractor}
import model.matching.wordMatching.WordWithRelatedWords
import model.{Applicability, SolutionNode}

final case class AnnotatedSolutionNode(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  wordsWithRelatedWords: Seq[WordWithRelatedWords],
  citedParagraphs: Seq[ParagraphCitation],
  children: Seq[AnnotatedSolutionNode]
)

object AnnotatedSolutionNode:

  def buildTree(wordAnnotator: WordAnnotator, nodes: Seq[SolutionNode]): Seq[AnnotatedSolutionNode] = {

    def buildChildren(parentId: Option[Int], remainingNodes: Seq[SolutionNode]): (Seq[AnnotatedSolutionNode], Seq[SolutionNode]) = {
      // find children
      val (childrenForCurrent, otherRemainingNodes) = remainingNodes.partition { _.parentId == parentId }

      // build tree container nodes for chilren...
      childrenForCurrent.foldLeft((Seq[AnnotatedSolutionNode](), otherRemainingNodes)) {
        case ((acc, remainingNodes), SolutionNode(id, childIndex, isSubText, text, applicability, parentId)) =>
          val (children, newRemainingNodes) = buildChildren(Some(id), remainingNodes)

          val (newText, paragraphCitationLocations) = ParagraphExtractor.extractAndReplace(text)
          val citedParagraphs                       = paragraphCitationLocations.flatMap { _.citedParagraphs }
          val wordsWithRelatedWords                 = wordAnnotator.resolveSynonyms(newText)

          val newNode = AnnotatedSolutionNode(id, childIndex, isSubText, text, applicability, parentId, wordsWithRelatedWords, citedParagraphs, children)

          (acc :+ newNode, newRemainingNodes)
      }
    }

    val (result, nodesLeftOver) = buildChildren(None, nodes)

    assert(nodesLeftOver.isEmpty)

    result
  }
