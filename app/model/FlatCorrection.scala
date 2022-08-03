package model

import sangria.macros.derive.deriveObjectType
import sangria.schema.{EnumType, ObjectType}

object SolutionTree extends Tree[SolutionNode, FlatSolutionNode] {

  override protected def flattenNode(node: SolutionNode, currentParentId: Option[Int]): FlatSolutionNode = node match {
    case SolutionNode(id, childIndex, text, applicability, subTexts, _) => FlatSolutionNode(id, childIndex, text, applicability, subTexts, currentParentId)
  }

  override protected def inflateNode(node: FlatSolutionNode, children: Seq[SolutionNode]): SolutionNode = node match {
    case FlatSolutionNode(id, childIndex, text, applicability, subTexts, _) => SolutionNode(id, childIndex, text, applicability, subTexts, children)
  }

  val flatSolutionGraphQLType: ObjectType[Unit, FlatSolutionNode] = {
    implicit val x0: EnumType[Applicability]               = Applicability.graphQLType
    implicit val x1: ObjectType[Unit, SolutionNodeSubText] = SolutionNodeSubText.graphQLType

    deriveObjectType()
  }

  private val flatSolutionNodeMatchGraphQLType: ObjectType[Unit, FlatSolutionNodeMatch] = deriveObjectType()

  val flatCorrectionGraphQLType: ObjectType[Unit, FlatCorrection] = {
    implicit val x0: ObjectType[Unit, FlatSolutionNode]      = flatSolutionGraphQLType
    implicit val x1: ObjectType[Unit, FlatSolutionNodeMatch] = flatSolutionNodeMatchGraphQLType

    deriveObjectType()
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
  sampleNodeIds: Seq[Int],
  userNodeIds: Seq[Int]
)

final case class FlatCorrection(
  sampleSolution: Seq[FlatSolutionNode],
  userSolution: Seq[FlatSolutionNode],
  matchingResult: Seq[FlatSolutionNodeMatch]
)
