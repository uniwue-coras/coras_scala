package model

trait TreeNode[T <: TreeNode[T]] {
  val id: Int
  val children: Seq[T]
}

trait FlatTreeNode {
  val id: Int
  val parentId: Option[Int]
}

object Tree {

  def flattenTree[T <: TreeNode[T], F <: FlatTreeNode](
    nodes: Seq[T],
    flattenNode: (T, Option[Int]) => F,
    currentParentId: Option[Int] = None
  ): Seq[F] = nodes.flatMap { node =>
    flattenNode(node, currentParentId) +: flattenTree(node.children, flattenNode, Some(node.id))
  }

  def inflateTree[F <: FlatTreeNode, T <: TreeNode[T]](
    flatNodes: Seq[F],
    inflateNode: (F, Seq[T]) => T
  ): Seq[T] = {

    def go(remainingNodes: Seq[F], currentParentId: Option[Int] = None): (Seq[T], Seq[F]) = {

      val (flatChildren, remainingOtherNodes) = remainingNodes.partition { _.parentId == currentParentId }

      flatChildren.foldLeft((Seq.empty[T], remainingOtherNodes)) { case ((acc, remainingNodes), cur) =>
        val (children, newRemainingNodes) = go(remainingNodes, Some(cur.id))

        (acc :+ inflateNode(cur, children), newRemainingNodes)
      }
    }

    go(flatNodes)._1
  }

}
