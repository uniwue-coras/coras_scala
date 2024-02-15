package model.graphql

import model._
import model.graphql.GraphQLArguments.sampleSolutionNodeIdArgument
import model.matching.WordAnnotator
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}
import model.matching.nodeMatching.AnnotatedSolutionNodeMatcher

object UserSolutionNodeGraphQLTypes extends GraphQLBasics:

  private val resolvePreviewMatchAgainst: Resolver[FlatUserSolutionNode, DefaultSolutionNodeMatch] = context => {
    implicit val ec  = context.ctx.ec
    val sampleNodeId = context.arg(sampleSolutionNodeIdArgument)
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

  private val resolveMatchWithSampleNode: Resolver[FlatUserSolutionNode, DbSolutionNodeMatch] = context => {
    implicit val ec: ExecutionContext                                                 = context.ctx.ec
    val FlatUserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _) = context.value
    val sampleSolutionNodeId                                                          = context.arg(GraphQLArguments.sampleSolutionNodeIdArgument)

    val newMatch = DbSolutionNodeMatch(username, exerciseId, sampleSolutionNodeId, userSolutionNodeId, MatchStatus.Manual, None)

    for {
      _ <- context.ctx.tableDefs.futureInsertMatch(newMatch)
    } yield newMatch
  }

  private val resolveDeleteMatch: Resolver[FlatUserSolutionNode, Boolean] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec
    val exerciseId                    = context.value.exerciseId
    val username                      = context.value.username
    val userSolutionNodeId            = context.value.id
    val sampleSolutionNodeId          = context.arg(GraphQLArguments.sampleSolutionNodeIdArgument)

    for {
      _ <- context.ctx.tableDefs.futureDeleteMatch(username, exerciseId, sampleSolutionNodeId, userSolutionNodeId)
    } yield true
  }

  private val resolveAnnotation: Resolver[FlatUserSolutionNode, Option[DbAnnotation]] = context =>
    context.ctx.tableDefs.futureMaybeAnnotationById(
      context.value.username,
      context.value.exerciseId,
      context.value.id,
      context.arg(GraphQLArguments.annotationIdArgument)
    )

  private val resolveUpsertAnnotation: Resolver[FlatUserSolutionNode, DbAnnotation] = context => {
    implicit val ec: ExecutionContext                                                            = context.ctx.ec
    val FlatUserSolutionNode(username, exerciseId, nodeId, _, _, _, _, _)                        = context.value
    val AnnotationInput(errorType, importance, startIndex, endIndex, text /*, annotationType*/ ) = context.arg(GraphQLArguments.annotationArgument)

    for {
      annotationId <- context.arg(GraphQLArguments.maybeAnnotationIdArgument) match {
        case Some(id) => Future.successful(id)
        case None     => context.ctx.tableDefs.futureNextAnnotationId(username, exerciseId, nodeId)
      }

      annotation = DbAnnotation(username, exerciseId, nodeId, annotationId, errorType, importance, startIndex, endIndex, text, AnnotationType.Manual)

      _ <- context.ctx.tableDefs.futureUpsertAnnotation(annotation)
    } yield annotation
  }

  val mutationType: ObjectType[GraphQLContext, FlatUserSolutionNode] = ObjectType(
    "UserSolutionNode",
    fields[GraphQLContext, FlatUserSolutionNode](
      Field(
        "previewMatchAgainst",
        DefaultSolutionNodeMatch.queryType,
        arguments = GraphQLArguments.sampleSolutionNodeIdArgument :: Nil,
        resolve = resolvePreviewMatchAgainst
      ),
      Field(
        "submitMatch",
        DbSolutionNodeMatch.queryType,
        arguments = GraphQLArguments.sampleSolutionNodeIdArgument :: Nil,
        resolve = resolveMatchWithSampleNode
      ),
      Field("deleteMatch", BooleanType, arguments = GraphQLArguments.sampleSolutionNodeIdArgument :: Nil, resolve = resolveDeleteMatch),
      Field(
        "upsertAnnotation",
        AnnotationGraphQLTypes.queryType,
        arguments = GraphQLArguments.maybeAnnotationIdArgument :: GraphQLArguments.annotationArgument :: Nil,
        resolve = resolveUpsertAnnotation
      ),
      Field(
        "annotation",
        OptionType(AnnotationGraphQLTypes.mutationType),
        arguments = GraphQLArguments.annotationIdArgument :: Nil,
        resolve = resolveAnnotation
      )
    )
  )
