package model.matching.nodeMatching

import model.matching.paragraphMatching.ParagraphCitation

final case class SolutionNodeContainer(
  node: AnnotatedSolutionNode,
  children: Seq[SolutionNodeContainer]
) {

  lazy val (subTextChildren, nodeChildren) = children.partition { _.node.isSubText }

  lazy val allCitedParagraphs: Seq[ParagraphCitation] = node.citedParagraphs ++ subTextChildren.flatMap { _.allCitedParagraphs }

}

object SolutionNodeContainer:
  private def buildChildren(
    parentId: Option[Int],
    remainingNodes: Seq[AnnotatedSolutionNode]
  ): (Seq[SolutionNodeContainer], Seq[AnnotatedSolutionNode]) = {
    // find children
    val (childrenForCurrent, otherRemainingNodes) = remainingNodes.partition { _.parentId == parentId }

    // build tree container nodes for chilren...
    childrenForCurrent.foldLeft((Seq[SolutionNodeContainer](), otherRemainingNodes)) { case ((acc, remainingNodes), current) =>
      val (children, newRemainingNodes) = buildChildren(Some(current.id), remainingNodes)

      (acc :+ SolutionNodeContainer(current, children), newRemainingNodes)
    }
  }

  def buildTree(nodes: Seq[AnnotatedSolutionNode]): Seq[SolutionNodeContainer] = {
    val (result, nodesLeftOver) = buildChildren(None, nodes)

    assert(nodesLeftOver.isEmpty)

    result
  }
