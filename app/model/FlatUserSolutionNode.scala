package model

import model.graphql.{GraphQLContext, Resolver}
import sangria.schema._

import scala.concurrent.ExecutionContext
import model.exporting.ExportedFlatUserSolutionNode
import scala.concurrent.Future

final case class FlatUserSolutionNode(
  username: String,
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends SolutionNode:

  def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedFlatUserSolutionNode] = for {
    subTextNodes         <- tableDefs.futureSubTextsForUserSolNode(username, exerciseId, id)
    exportedSubTextNodes <- Future.traverse(subTextNodes) { _.exportData(tableDefs) }

    annotations <- tableDefs.futureAnnotationsForUserSolutionNode(username, exerciseId, id)
  } yield ExportedFlatUserSolutionNode(id, childIndex, text, applicability, parentId, exportedSubTextNodes, annotations.map { _._2 })

object FlatUserSolutionNode:

  private val startIndexArgument: Argument[Int] = Argument("startIndex", IntType)
  private val endIndexArgument: Argument[Int]   = Argument("endIndex", IntType)

  private val resolveSubTextNodes: Resolver[FlatUserSolutionNode, Seq[UserSubTextNode]] = context =>
    context.ctx.tableDefs.futureSubTextsForUserSolNode(context.value.username, context.value.exerciseId, context.value.id)

  private val resolveSubTexts: Resolver[FlatUserSolutionNode, Seq[String]] = context => {
    implicit val ec = context.ctx.ec

    for {
      subTextNodes <- context.ctx.tableDefs.futureSubTextsForUserSolNode(context.value.username, context.value.exerciseId, context.value.id)
    } yield subTextNodes.map(_.text)
  }

  private val resolveAnnotations: Resolver[FlatUserSolutionNode, Seq[(NodeAnnotationKey, Annotation)]] = context =>
    context.ctx.tableDefs.futureAnnotationsForUserSolutionNode(context.value.username, context.value.exerciseId, context.value.id)

  private val resolveAnnotationTextRecommendations: Resolver[FlatUserSolutionNode, Seq[String]] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    val FlatUserSolutionNode(username, exerciseId, userSolutionNodeId, _, text, _, _) = context.value
    val markedText = text.substring(context.arg(startIndexArgument), context.arg(endIndexArgument))

    for {
      annotationRecommendations <- context.ctx.tableDefs.futureFindOtherCorrectedUserNodes(username, exerciseId, userSolutionNodeId)

      texts = annotationRecommendations
        .sortBy { case ((_, annotation), nodeText) => levenshteinDistance(markedText, nodeText.substring(annotation.startIndex, annotation.endIndex)) }
        .map { case ((_, annotation), _) => annotation.text }
    } yield texts
  }

  val queryType: ObjectType[GraphQLContext, FlatUserSolutionNode] = ObjectType[GraphQLContext, FlatUserSolutionNode](
    "FlatUserSolutionNode",
    interfaces[GraphQLContext, FlatUserSolutionNode](SolutionNode.interfaceType),
    fields[GraphQLContext, FlatUserSolutionNode](
      Field("subTextNodes", ListType(UserSubTextNode.queryType), resolve = resolveSubTextNodes),
      Field("subTexts", ListType(StringType), resolve = resolveSubTexts),
      Field("annotations", ListType(Annotation.queryType), resolve = resolveAnnotations),
      Field(
        "annotationTextRecommendations",
        ListType(StringType),
        arguments = startIndexArgument :: endIndexArgument :: Nil,
        resolve = resolveAnnotationTextRecommendations
      )
    )
  )
