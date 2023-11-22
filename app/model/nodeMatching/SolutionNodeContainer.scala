package model.nodeMatching

final case class SolutionNodeContainer(
  node: FlatSolutionNodeWithData,
  children: Seq[SolutionNodeContainer]
)

object SolutionNodeContainer:
  private def buildChildren(
    parentId: Option[Int],
    remainingNodes: Seq[FlatSolutionNodeWithData]
  ): (Seq[SolutionNodeContainer], Seq[FlatSolutionNodeWithData]) = {
    // find children
    val (childrenForCurrent, otherRemainingNodes) = remainingNodes.partition { _.parentId == parentId }

    // build tree container nodes for chilren...
    childrenForCurrent.foldLeft((Seq[SolutionNodeContainer](), otherRemainingNodes)) { case ((acc, remainingNodes), current) =>
      val (children, newRemainingNodes) = buildChildren(Some(current.nodeId), remainingNodes)

      (acc :+ SolutionNodeContainer(current, children), newRemainingNodes)
    }
  }

  def buildTree(nodes: Seq[FlatSolutionNodeWithData]): Seq[SolutionNodeContainer] = {
    val (result, nodesLeftOver) = buildChildren(None, nodes)

    assert(nodesLeftOver.isEmpty)

    result
  }
