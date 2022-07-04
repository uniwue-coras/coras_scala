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

object MyTestTree extends Tree[TestTreeNode, FlatTestTreeNode] {

  override protected def flattenNode(node: TestTreeNode, currentParentId: Option[Int] = None): FlatTestTreeNode = FlatTestTreeNode(node.id, currentParentId)

  override protected def inflateNode(node: FlatTestTreeNode, children: Seq[TestTreeNode]): TestTreeNode = TestTreeNode(node.id, children)

}

class TreeTest extends AnyFlatSpec with Matchers {

  private type Tree = Seq[TestTreeNode]

  private type FlatTree = Seq[FlatTestTreeNode]

  behavior of "Tree"

  it should "flatten trees" in {

    MyTestTree.flattenTree(Seq.empty) shouldBe Seq.empty
    MyTestTree.inflateTree(Seq.empty) shouldBe Seq.empty

    val firstTree: Tree = Seq(
      TestTreeNode(1)
    )
    val firstFlatTree: FlatTree = Seq(
      FlatTestTreeNode(1)
    )

    MyTestTree.flattenTree(firstTree) shouldBe firstFlatTree
    MyTestTree.inflateTree(firstFlatTree) shouldBe firstTree

    val secondTree: Tree = Seq(
      TestTreeNode(1),
      TestTreeNode(2)
    )
    val secondFlatTree: FlatTree = Seq(
      FlatTestTreeNode(1),
      FlatTestTreeNode(2)
    )

    MyTestTree.flattenTree(secondTree) shouldBe secondFlatTree
    MyTestTree.inflateTree(secondFlatTree) shouldBe secondTree

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

    MyTestTree.flattenTree(thirdTree) shouldBe thirdFlatTree
    MyTestTree.inflateTree(thirdFlatTree) shouldBe thirdTree

  }

}
