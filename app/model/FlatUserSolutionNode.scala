package model

import model.exporting.{ExportedFlatUserSolutionNode, NodeExportable}
import model.graphql.{GraphQLArguments, GraphQLContext, MyQueryType, UserFacingGraphQLError}
import model.matching.WordAnnotator
import model.matching.nodeMatching.AnnotatedSolutionNodeMatcher
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

final case class FlatUserSolutionNode(
  username: String,
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends SolutionNode
    with NodeExportable[ExportedFlatUserSolutionNode]:

  override def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedFlatUserSolutionNode] = for {
    annotations <- tableDefs.futureAnnotationsForUserSolutionNode(username, exerciseId, id)

    exportedAnnotations = annotations.map { _.exportData }
  } yield ExportedFlatUserSolutionNode(id, childIndex, isSubText, text, applicability, parentId, exportedAnnotations)

object FlatUserSolutionNodeGraphQLTypes extends MyQueryType[FlatUserSolutionNode]:

  private val startIndexArgument: Argument[Int] = Argument("startIndex", IntType)
  private val endIndexArgument: Argument[Int]   = Argument("endIndex", IntType)

  private val resolvePreviewMatchAgainst: Resolver[FlatUserSolutionNode, DefaultSolutionNodeMatch] = context => {
    implicit val ec  = context.ctx.ec
    val sampleNodeId = context.arg(GraphQLArguments.sampleSolutionNodeIdArgument)
    val userNode     = context.value

    for {
      maybeSampleNode <- context.ctx.tableDefs.futureSampleSolutionNodeForExercise(context.value.exerciseId, sampleNodeId)

      sampleNode <- maybeSampleNode match
        case None       => Future.failed(UserFacingGraphQLError("Could not find sample solution node..."))
        case Some(node) => Future.successful(node)

      abbreviations     <- context.ctx.tableDefs.futureAllAbbreviationsAsMap
      relatedWordGroups <- context.ctx.tableDefs.futureAllRelatedWordGroups

      wordAnnotator = WordAnnotator(abbreviations, relatedWordGroups.map { _.content })

      annotatedSampleNode = wordAnnotator.annotateNode(sampleNode)
      annotatedUserNode   = wordAnnotator.annotateNode(userNode)

      maybeExplanation =
        if sampleNode.text == userNode.text then None
        else Some(AnnotatedSolutionNodeMatcher(0.0).generateFuzzyMatchExplanation(annotatedSampleNode, annotatedUserNode))

    } yield DefaultSolutionNodeMatch(sampleNode.id, userNode.id, maybeExplanation)
  }

  private val resolveAnnotations: Resolver[FlatUserSolutionNode, Seq[DbAnnotation]] = context =>
    context.ctx.tableDefs.futureAnnotationsForUserSolutionNode(context.value.username, context.value.exerciseId, context.value.id)

  private val resolveAnnotationTextRecommendations: Resolver[FlatUserSolutionNode, Seq[String]] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    val FlatUserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, text, _, _) = context.value
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
      Field(
        "previewMatchAgainst",
        DefaultSolutionNodeMatch.queryType,
        arguments = GraphQLArguments.sampleSolutionNodeIdArgument :: Nil,
        resolve = resolvePreviewMatchAgainst
      ),
      Field("annotations", ListType(AnnotationGraphQLTypes.queryType), resolve = resolveAnnotations),
      Field(
        "annotationTextRecommendations",
        ListType(StringType),
        arguments = startIndexArgument :: endIndexArgument :: Nil,
        resolve = resolveAnnotationTextRecommendations
      )
    )
  )
