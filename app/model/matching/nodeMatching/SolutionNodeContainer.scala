package model.matching.nodeMatching

final case class SolutionNodeContainer(
  node: AnnotatedSolutionNode,
  children: Seq[SolutionNodeContainer]
)

object SolutionNodeContainer:
  private def buildChildren(
    parentId: Option[Int],
    remainingNodes: Seq[AnnotatedSolutionNode]
  ): (Seq[SolutionNodeContainer], Seq[AnnotatedSolutionNode]) = {
    // find children
    val (childrenForCurrent, otherRemainingNodes) = remainingNodes.partition { _.parentId == parentId }

    // build tree container nodes for chilren...
    childrenForCurrent.foldLeft((Seq[SolutionNodeContainer](), otherRemainingNodes)) { case ((acc, remainingNodes), current) =>
      val (children, newRemainingNodes) = buildChildren(Some(current.nodeId), remainingNodes)

      (acc :+ SolutionNodeContainer(current, children), newRemainingNodes)
    }
  }

  def buildTree(nodes: Seq[AnnotatedSolutionNode]): Seq[SolutionNodeContainer] = {
    val (result, nodesLeftOver) = buildChildren(None, nodes)

    assert(nodesLeftOver.isEmpty)

    result
  }
