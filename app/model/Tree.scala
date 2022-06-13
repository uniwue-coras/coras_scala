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
    tree: Seq[T],
    flattenNode: (T, Option[Int]) => (F, Seq[T]),
    currentParentId: Option[Int] = None
  ): Seq[F] = {

    @scala.annotation.tailrec
    def go(remainingTree: List[T], acc: Seq[F]): Seq[F] = remainingTree match {
      case Nil => acc
      case head :: tail =>
        val (newHead, children) = flattenNode(head, currentParentId)

        val flatChildren = flattenTree(children, flattenNode, Some(head.id))

        go(tail, (acc :+ newHead) ++ flatChildren)
    }

    go(tree.toList, Seq.empty)
  }

  def inflateTree[F <: FlatTreeNode, T <: TreeNode[T]](flatTree: Seq[F]): Seq[T] = ???

}
