package model

import model.exporting.{ExportedFlatSampleSolutionNode, LeafExportable}
import model.graphql.{GraphQLContext, MyQueryType}
import sangria.schema.{ObjectType, interfaces, fields, Field, ListType, StringType}
import scala.concurrent.ExecutionContext

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

  private val resolveSubTexts: Resolver[FlatSampleSolutionNode, Seq[String]] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    for {
      subTextNodes <- context.ctx.tableDefs.futureSubTextNodesForSampleSolNode(context.value.exerciseId, context.value.id)
    } yield subTextNodes.map(_.text)
  }

  override val queryType: ObjectType[GraphQLContext, FlatSampleSolutionNode] = ObjectType[GraphQLContext, FlatSampleSolutionNode](
    "FlatSampleSolutionNode",
    interfaces[GraphQLContext, FlatSampleSolutionNode](SolutionNodeGraphQLTypes.flatSolutionNodeGraphQLInterfaceType),
    fields[GraphQLContext, FlatSampleSolutionNode](
      Field("subTexts", ListType(StringType), resolve = resolveSubTexts)
    )
  )
