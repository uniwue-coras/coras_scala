package model

import model.graphql.{GraphQLContext, MyQueryType}
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

final case class FlatUserSolutionNode(
  username: String,
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends SolutionNode:
  def resolveSubTexts(context: GraphQLContext): Future[Seq[String]] = {
    implicit val ec = context.ec

    for {
      subTextNodes <- context.tableDefs.futureSubTextsForUserSolNode(username, exerciseId, id)
    } yield subTextNodes.map(_.text)

  }

object FlatUserSolutionNodeGraphQLTypes extends MyQueryType[FlatUserSolutionNode]:

  private val startIndexArgument: Argument[Int] = Argument("startIndex", IntType)
  private val endIndexArgument: Argument[Int]   = Argument("endIndex", IntType)

  private val resolveSubTexts: Resolver[FlatUserSolutionNode, Seq[String]] = context => {
    implicit val ec = context.ctx.ec

    for {
      subTextNodes <- context.ctx.tableDefs.futureSubTextsForUserSolNode(context.value.username, context.value.exerciseId, context.value.id)
    } yield subTextNodes.map(_.text)
  }

  private val resolveAnnotations: Resolver[FlatUserSolutionNode, Seq[DbAnnotation]] = context =>
    context.ctx.tableDefs.futureAnnotationsForUserSolutionNode(context.value.username, context.value.exerciseId, context.value.id)

  private val resolveAnnotationTextRecommendations: Resolver[FlatUserSolutionNode, Seq[String]] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    val FlatUserSolutionNode(username, exerciseId, userSolutionNodeId, _, text, _, _) = context.value
    val markedText = text.substring(context.arg(startIndexArgument), context.arg(endIndexArgument))

    for {
      annotationRecommendations <- context.ctx.tableDefs.futureFindOtherCorrectedUserNodes(username, exerciseId, userSolutionNodeId)

      texts = annotationRecommendations
        .sortBy { case (annotation, nodeText) => levenshteinDistance(markedText, nodeText.substring(annotation.startIndex, annotation.endIndex)) }
        .map { case (annotation, _) => annotation.text }
    } yield texts
  }

  override val queryType: ObjectType[GraphQLContext, FlatUserSolutionNode] = ObjectType[GraphQLContext, FlatUserSolutionNode](
    "FlatUserSolutionNode",
    interfaces[GraphQLContext, FlatUserSolutionNode](SolutionNodeGraphQLTypes.flatSolutionNodeGraphQLInterfaceType),
    fields[GraphQLContext, FlatUserSolutionNode](
      Field("subTexts", ListType(StringType), resolve = resolveSubTexts),
      Field("annotations", ListType(AnnotationGraphQLTypes.queryType), resolve = resolveAnnotations),
      Field(
        "annotationTextRecommendations",
        ListType(StringType),
        arguments = startIndexArgument :: endIndexArgument :: Nil,
        resolve = resolveAnnotationTextRecommendations
      )
    )
  )
