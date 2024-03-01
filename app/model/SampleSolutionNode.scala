package model

import model.exporting.{ExportedFlatSampleSolutionNode, LeafExportable}
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

import scala.concurrent.ExecutionContext

final case class SampleSolutionNode(
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

object SampleSolutionNode extends GraphQLBasics:

  private val resolveSubTexts: Resolver[SampleSolutionNode, Seq[String]] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    for {
      subTextNodes <- context.ctx.tableDefs.futureSubTextNodesForSampleSolNode(context.value.exerciseId, context.value.id)
    } yield subTextNodes.map(_.text)
  }

  val queryType: ObjectType[GraphQLContext, SampleSolutionNode] = ObjectType[GraphQLContext, SampleSolutionNode](
    "FlatSampleSolutionNode",
    interfaces[GraphQLContext, SampleSolutionNode](SolutionNodeGraphQLTypes.flatSolutionNodeGraphQLInterfaceType),
    fields[GraphQLContext, SampleSolutionNode](
      Field("subTexts", ListType(StringType), resolve = resolveSubTexts)
    )
  )
