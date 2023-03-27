package model.graphql

import model._
import model.graphql.GraphQLArguments.{annotationArgument, annotationIdArgument, maybeAnnotationIdArgument, sampleSolutionNodeIdArgument}
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

object UserSolutionNodeGraphQLTypes extends GraphQLBasics {

  private implicit val ec: ExecutionContext = ExecutionContext.global

  private val resolveMatchWithSampleNode: Resolver[FlatUserSolutionNode, SolutionNodeMatch] = context => {
    val FlatUserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _) = context.value
    val sampleSolutionNodeId                                                          = context.arg(sampleSolutionNodeIdArgument)

    val newMatch = SolutionNodeMatch(username, exerciseId, sampleSolutionNodeId, userSolutionNodeId, MatchStatus.Manual, None)

    for {
      _ <- context.ctx.tableDefs.futureInsertMatch(newMatch)
    } yield newMatch
  }

  private val resolveDeleteAnnotation: Resolver[FlatUserSolutionNode, Int] = context => {
    val annotationId = context.arg(annotationIdArgument)

    for {
      _ <- context.ctx.tableDefs.futureDeleteAnnotation(context.value.username, context.value.exerciseId, context.value.id, annotationId)
    } yield annotationId
  }

  private val resolveUpsertAnnotation: Resolver[FlatUserSolutionNode, Annotation] = context => {
    val FlatUserSolutionNode(username, exerciseId, nodeId, _, _, _, _, _) = context.value
    val AnnotationInput(errorType, startIndex, endIndex, text)            = context.arg(annotationArgument)

    for {
      annotationId <- context.arg(maybeAnnotationIdArgument) match {
        case Some(id) => Future.successful(id)
        case None     => context.ctx.tableDefs.futureNextAnnotationId(username, exerciseId, nodeId)
      }

      annotation = Annotation(username, exerciseId, nodeId, annotationId, errorType, startIndex, endIndex, text)

      _ <- context.ctx.tableDefs.futureUpsertAnnotation(annotation)
    } yield annotation
  }

  val userSolutionNodeMutationType: ObjectType[GraphQLContext, FlatUserSolutionNode] = ObjectType(
    "UserSolutionNode",
    fields[GraphQLContext, FlatUserSolutionNode](
      Field(
        "matchWithSampleNode",
        SolutionNodeMatchGraphQLTypes.queryType,
        arguments = sampleSolutionNodeIdArgument :: Nil,
        resolve = resolveMatchWithSampleNode
      ),
      Field("deleteAnnotation", IntType, arguments = annotationIdArgument :: Nil, resolve = resolveDeleteAnnotation),
      Field(
        "upsertAnnotation",
        AnnotationGraphQLTypes.annotationQueryType,
        arguments = maybeAnnotationIdArgument :: annotationArgument :: Nil,
        resolve = resolveUpsertAnnotation
      )
    )
  )

}
