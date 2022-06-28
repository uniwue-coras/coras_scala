package model

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

final case class TestTreeNode(
  override val id: Int,
  override val children: Seq[TestTreeNode] = Seq.empty
) extends TreeNode[TestTreeNode]

final case class FlatTestTreeNode(
  override val id: Int,
  override val parentId: Option[Int] = None
) extends FlatTreeNode

class TreeTest extends AnyFlatSpec with Matchers {

  private type Tree = Seq[TestTreeNode]

  private type FlatTree = Seq[FlatTestTreeNode]

  def flattenNode(node: TestTreeNode, currentParentId: Option[Int] = None): FlatTestTreeNode = FlatTestTreeNode(node.id, currentParentId)

  def inflateNode(node: FlatTestTreeNode, children: Seq[TestTreeNode]): TestTreeNode = TestTreeNode(node.id, children)

  behavior of "Tree"

  it should "flatten trees" in {

    Tree.flattenTree(Seq.empty, flattenNode) shouldBe Seq.empty
    Tree.inflateTree(Seq.empty, inflateNode) shouldBe Seq.empty

    val firstTree: Tree = Seq(
      TestTreeNode(1)
    )
    val firstFlatTree: FlatTree = Seq(
      FlatTestTreeNode(1)
    )

    Tree.flattenTree(firstTree, flattenNode) shouldBe firstFlatTree
    Tree.inflateTree(firstFlatTree, inflateNode) shouldBe firstTree

    val secondTree: Tree = Seq(
      TestTreeNode(1),
      TestTreeNode(2)
    )
    val secondFlatTree: FlatTree = Seq(
      FlatTestTreeNode(1),
      FlatTestTreeNode(2)
    )

    Tree.flattenTree(secondTree, flattenNode) shouldBe secondFlatTree
    Tree.inflateTree(secondFlatTree, inflateNode) shouldBe secondTree

    val thirdTree: Tree = Seq(
      TestTreeNode(1, Seq(TestTreeNode(11, Seq(TestTreeNode(111))))),
      TestTreeNode(2, Seq(TestTreeNode(21)))
    )
    val thirdFlatTree: FlatTree = Seq(
      FlatTestTreeNode(1),
      FlatTestTreeNode(11, Some(1)),
      FlatTestTreeNode(111, Some(11)),
      FlatTestTreeNode(2),
      FlatTestTreeNode(21, Some(2))
    )

    Tree.flattenTree(thirdTree, flattenNode) shouldBe thirdFlatTree
    Tree.inflateTree(thirdFlatTree, inflateNode) shouldBe thirdTree
  
  }

}
