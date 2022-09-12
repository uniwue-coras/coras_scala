package model

object SolutionTree extends Tree[SolutionNode, FlatSolutionNode] {

  override protected def flattenNode(node: SolutionNode, currentParentId: Option[Int]): FlatSolutionNode = node match {
    case SolutionNode(id, childIndex, text, applicability, subTexts, _) => FlatSolutionNode(id, childIndex, text, applicability, subTexts, currentParentId)
  }

  override protected def inflateNode(node: FlatSolutionNode, children: Seq[SolutionNode]): SolutionNode = node match {
    case FlatSolutionNode(id, childIndex, text, applicability, subTexts, _) => SolutionNode(id, childIndex, text, applicability, subTexts, children)
  }

}

final case class FlatSolutionNode(
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionNodeSubText],
  parentId: Option[Int]
) extends FlatTreeNode

final case class FlatSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int
)

final case class FlatCorrection(
  sampleSolution: Seq[FlatSolutionNode],
  userSolution: Seq[FlatSolutionNode],
  matchingResult: Seq[FlatSolutionNodeMatch]
)
