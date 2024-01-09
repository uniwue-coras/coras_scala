package model

import model.graphql.{GraphQLBasics, GraphQLContext, Resolver}
import sangria.schema._

final case class FlatSampleSolutionNode(
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends SolutionNode

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
