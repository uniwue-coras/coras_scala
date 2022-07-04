package model

trait TreeNode[T <: TreeNode[T]] {
  val id: Int
  val children: Seq[T]
}

trait FlatTreeNode {
  val id: Int
  val parentId: Option[Int]
}

trait Tree[T <: TreeNode[T], F <: FlatTreeNode] {

  protected def flattenNode(node: T, currentParentId: Option[Int]): F

  protected def inflateNode(node: F, children: Seq[T]): T

  def flattenTree(nodes: Seq[T], currentParentId: Option[Int] = None): Seq[F] = nodes.flatMap { node =>
    flattenNode(node, currentParentId) +: flattenTree(node.children, Some(node.id))
  }

  def inflateTree(flatNodes: Seq[F]): Seq[T] = {

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
