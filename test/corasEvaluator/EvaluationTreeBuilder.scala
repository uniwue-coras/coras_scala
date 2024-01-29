package corasEvaluator

import model.SubTextNode
import model.exporting.ExportedSolutionNode
import model.matching.nodeMatching.{AnnotatedSolutionNode, AnnotatedSubTextNode, SolutionNodeContainer}
import model.matching.paragraphMatching.ParagraphExtractor
import model.matching.wordMatching.WordAnnotator

class EvaluationTreeBuilder(wordAnnotator: WordAnnotator):

  protected def annotateSubTextNodes(subTextNodes: Seq[SubTextNode]): Seq[AnnotatedSubTextNode] = subTextNodes.map { subTextNode =>
    AnnotatedSubTextNode(subTextNode.nodeId, subTextNode.id, subTextNode.text, subTextNode.applicability, wordAnnotator.resolveSynonyms(subTextNode.text))
  }

  private def buildChildren[Node <: ExportedSolutionNode](
    parentId: Option[Int],
    remainingNodes: Seq[Node]
  ): (Seq[SolutionNodeContainer], Seq[Node]) = {
    // find children...
    val (childrenForCurrent, otherRemainingNodes) = remainingNodes.partition { _.parentId == parentId }

    childrenForCurrent.foldLeft((Seq[SolutionNodeContainer](), otherRemainingNodes)) { case ((acc, remainingNodes), current) =>
      // val (ownSubTexts, otherRemainingSubTexNodes) = remainingSubTexts.partition(_.nodeId == current.id)

      val (children, newRemainingNodes) = buildChildren(Some(current.id), remainingNodes)

      val (newText, extractedParagraphCitations) = ParagraphExtractor.extractAndReplace(current.text)

      val ownSubTexts = annotateSubTextNodes(current.subTextNodes)

      val nodeWithData = AnnotatedSolutionNode(
        id = current.id,
        childIndex = current.childIndex,
        text = current.text,
        applicability = current.applicability,
        parentId = current.parentId,
        subTextNodes = ownSubTexts,
        wordsWithRelatedWords = wordAnnotator.resolveSynonyms(newText)
      )

      (acc :+ SolutionNodeContainer(nodeWithData, children), newRemainingNodes)
    }
  }

  def buildSolutionTree[Node <: ExportedSolutionNode](nodes: Seq[Node]): Seq[SolutionNodeContainer] = {

    val (result, remainingNodes) = buildChildren(None, nodes)

    assert(remainingNodes.isEmpty)

    result
  }
