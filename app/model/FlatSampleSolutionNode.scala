package model

import model.graphql.{GraphQLContext, MyQueryType}
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

final case class FlatSampleSolutionNode(
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends SolutionNode:

  def resolveSubTexts(context: GraphQLContext): Future[Seq[String]] = {
    implicit val ec: ExecutionContext = context.ec

    for {
      subTextNodes <- context.tableDefs.futureSubTextsForSampleSolNode(exerciseId, id)
    } yield subTextNodes.map(_.text)
  }

object FlatSampleSolutionNodeGraphQLTypes extends MyQueryType[FlatSampleSolutionNode]:

  private val resolveSubTexts: Resolver[FlatSampleSolutionNode, Seq[String]] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    for {
      subTextNodes <- context.ctx.tableDefs.futureSubTextsForSampleSolNode(context.value.exerciseId, context.value.id)
    } yield subTextNodes.map(_.text)
  }

  override val queryType: ObjectType[GraphQLContext, FlatSampleSolutionNode] = ObjectType[GraphQLContext, FlatSampleSolutionNode](
    "FlatSampleSolutionNode",
    interfaces[GraphQLContext, FlatSampleSolutionNode](SolutionNodeGraphQLTypes.flatSolutionNodeGraphQLInterfaceType),
    fields[GraphQLContext, FlatSampleSolutionNode](
      Field("subTexts", ListType(StringType), resolve = resolveSubTexts)
    )
  )
