package model.graphql

import model._
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

object UserSolutionNodeGraphQLMutations extends GraphQLBasics:

  private val resolveMatchWithSampleNode: Resolver[FlatUserSolutionNode, DbSolutionNodeMatch] = context => {
    implicit val ec: ExecutionContext                                              = context.ctx.ec
    val FlatUserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _) = context.value
    val sampleSolutionNodeId                                                       = context.arg(GraphQLArguments.sampleSolutionNodeIdArgument)

    val newMatch = DbSolutionNodeMatch(sampleSolutionNodeId, userSolutionNodeId, MatchStatus.Manual, None)

    for {
      _ <- context.ctx.tableDefs.futureInsertMatch(SolutionNodeMatchKey(username, exerciseId), newMatch)
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

  private val resolveAnnotation: Resolver[FlatUserSolutionNode, Option[(NodeAnnotationKey, Annotation)]] = context =>
    context.ctx.tableDefs.futureMaybeAnnotationById(
      context.value.username,
      context.value.exerciseId,
      context.value.id,
      context.arg(GraphQLArguments.annotationIdArgument)
    )

  private val resolveUpsertAnnotation: Resolver[FlatUserSolutionNode, (NodeAnnotationKey, Annotation)] = context => {
    implicit val ec: ExecutionContext                                                            = context.ctx.ec
    val FlatUserSolutionNode(username, exerciseId, nodeId, _, _, _, _)                           = context.value
    val AnnotationInput(errorType, importance, startIndex, endIndex, text /*, annotationType*/ ) = context.arg(GraphQLArguments.annotationArgument)

    for {
      annotationId <- context.arg(GraphQLArguments.maybeAnnotationIdArgument) match {
        case Some(id) => Future.successful(id)
        case None     => context.ctx.tableDefs.futureNextAnnotationId(username, exerciseId, nodeId)
      }

      annoKey    = NodeAnnotationKey(username, exerciseId, nodeId)
      annotation = Annotation(annotationId, errorType, importance, startIndex, endIndex, text, AnnotationType.Manual)

      _ <- context.ctx.tableDefs.futureUpsertAnnotation(annoKey, annotation)
    } yield (annoKey, annotation)
  }

  val mutationType: ObjectType[GraphQLContext, FlatUserSolutionNode] = ObjectType(
    "UserSolutionNode",
    fields[GraphQLContext, FlatUserSolutionNode](
      Field(
        "submitMatch",
        SolutionNodeMatchGraphQLTypes.queryType,
        arguments = GraphQLArguments.sampleSolutionNodeIdArgument :: Nil,
        resolve = resolveMatchWithSampleNode
      ),
      Field("deleteMatch", BooleanType, arguments = GraphQLArguments.sampleSolutionNodeIdArgument :: Nil, resolve = resolveDeleteMatch),
      Field(
        "upsertAnnotation",
        Annotation.queryType,
        arguments = GraphQLArguments.maybeAnnotationIdArgument :: GraphQLArguments.annotationArgument :: Nil,
        resolve = resolveUpsertAnnotation
      ),
      Field(
        "annotation",
        OptionType(Annotation.mutationType),
        arguments = GraphQLArguments.annotationIdArgument :: Nil,
        resolve = resolveAnnotation
      )
    )
  )
