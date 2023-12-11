package model

import model.exporting.{ExportedFlatSampleSolutionNode, LeafExportable}
import model.graphql.{GraphQLContext, MyQueryType}
import sangria.schema.{ObjectType, interfaces}

final case class FlatSampleSolutionNode(
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends SolutionNode
    with LeafExportable[ExportedFlatSampleSolutionNode]:
  override def exportData: ExportedFlatSampleSolutionNode = ExportedFlatSampleSolutionNode(id, childIndex, isSubText, text, applicability, parentId)

object FlatSampleSolutionNodeGraphQLTypes extends MyQueryType[FlatSampleSolutionNode]:
  override val queryType: ObjectType[GraphQLContext, FlatSampleSolutionNode] = ObjectType[GraphQLContext, FlatSampleSolutionNode](
    "FlatSampleSolutionNode",
    interfaces[GraphQLContext, FlatSampleSolutionNode](SolutionNodeGraphQLTypes.flatSolutionNodeGraphQLInterfaceType),
    Nil
  )
