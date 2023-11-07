package model

import model.export.{ExportedFlatSampleSolutionNode, LeafExportable}
import model.graphql.{GraphQLContext, QueryType}
import sangria.schema.{ObjectType, fields, interfaces}

final case class FlatSampleSolutionNode(
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends IFlatSolutionNode
    with LeafExportable[ExportedFlatSampleSolutionNode] {

  override def exportData: ExportedFlatSampleSolutionNode = ExportedFlatSampleSolutionNode(id, childIndex, isSubText, text, applicability, parentId)

}

object FlatSampleSolutionNodeGraphQLTypes extends QueryType[FlatSampleSolutionNode] {

  override val queryType: ObjectType[GraphQLContext, FlatSampleSolutionNode] = ObjectType[GraphQLContext, FlatSampleSolutionNode](
    "FlatSampleSolutionNode",
    interfaces[GraphQLContext, FlatSampleSolutionNode](IFlatSolutionNodeGraphQLTypes.flatSolutionNodeGraphQLInterfaceType),
    fields[GraphQLContext, FlatSampleSolutionNode]()
  )

}
