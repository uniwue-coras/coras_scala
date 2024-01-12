package model

import model.graphql.{GraphQLBasics, GraphQLContext, Resolver}
import sangria.schema._
import model.exporting.ExportedFlatSampleSolutionNode
import scala.concurrent.Future
import scala.concurrent.ExecutionContext

final case class FlatSampleSolutionNode(
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends SolutionNode:
  def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedFlatSampleSolutionNode] = for {
    subTextNodes <- tableDefs.futureSubTextsForSampleSolNode(exerciseId, id)
    exportedSubTextNodes = subTextNodes.map { _.exportData }
  } yield ExportedFlatSampleSolutionNode(id, childIndex, text, applicability, parentId, exportedSubTextNodes)

object FlatSampleSolutionNode extends GraphQLBasics:
  private val resolveSubTextNodes: Resolver[FlatSampleSolutionNode, Seq[SampleSubTextNode]] = context =>
    context.ctx.tableDefs.futureSubTextsForSampleSolNode(context.value.exerciseId, context.value.id)

  val queryType: ObjectType[GraphQLContext, FlatSampleSolutionNode] = ObjectType[GraphQLContext, FlatSampleSolutionNode](
    "FlatSampleSolutionNode",
    interfaces[GraphQLContext, FlatSampleSolutionNode](SolutionNode.interfaceType),
    fields[GraphQLContext, FlatSampleSolutionNode](
      Field("subTextNodes", ListType(SampleSubTextNode.queryType), resolve = resolveSubTextNodes)
    )
  )
