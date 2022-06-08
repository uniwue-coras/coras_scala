package model

trait TreeNode[T <: TreeNode[T]] {
  val id: Int
}

trait FlatTreeNode {
  val id: Int
  val parentId: Int
}

object Tree {

  def flattenTree[T <: TreeNode[T], F <: FlatTreeNode](tree: Seq[T]): Seq[F] = ???

  def inflateTree[F <: FlatTreeNode, T <: TreeNode[T]](flatTree: Seq[F]): Seq[T] = ???

}
