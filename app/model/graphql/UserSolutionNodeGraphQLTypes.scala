package model.graphql

import de.uniwue.ls6.model.{AnnotationType, MatchStatus}
import model._
import model.graphql.GraphQLArguments.{annotationArgument, annotationIdArgument, maybeAnnotationIdArgument, sampleSolutionNodeIdArgument}
import sangria.schema._

import scala.annotation.unused
import scala.concurrent.{ExecutionContext, Future}

object UserSolutionNodeGraphQLTypes extends GraphQLBasics {

  private val resolveMatchWithSampleNode: Resolver[FlatUserSolutionNode, DbSolutionNodeMatch] = context => {
    @unused implicit val ec: ExecutionContext                                         = context.ctx.ec
    val FlatUserSolutionNode(username, exerciseId, userSolutionNodeId, _, _, _, _, _) = context.value
    val sampleSolutionNodeId                                                          = context.arg(sampleSolutionNodeIdArgument)

    val newMatch = DbSolutionNodeMatch(username, exerciseId, sampleSolutionNodeId, userSolutionNodeId, MatchStatus.Manual, None)

    for {
      _ <- context.ctx.tableDefs.futureInsertMatch(newMatch)
    } yield newMatch
  }

  private val resolveDeleteMatch: Resolver[FlatUserSolutionNode, Boolean] = context => {
    @unused implicit val ec: ExecutionContext = context.ctx.ec
    val exerciseId                            = context.value.exerciseId
    val username                              = context.value.username
    val userSolutionNodeId                    = context.value.id
    val sampleSolutionNodeId                  = context.arg(sampleSolutionNodeIdArgument)

    for {
      _ <- context.ctx.tableDefs.futureDeleteMatch(username, exerciseId, sampleSolutionNodeId, userSolutionNodeId)
    } yield true
  }

  private val resolveAnnotation: Resolver[FlatUserSolutionNode, Option[DbAnnotation]] = context =>
    context.ctx.tableDefs.futureMaybeAnnotationById(context.value.username, context.value.exerciseId, context.value.id, context.arg(annotationIdArgument))

  private val resolveUpsertAnnotation: Resolver[FlatUserSolutionNode, DbAnnotation] = context => {
    @unused implicit val ec: ExecutionContext                                                    = context.ctx.ec
    val FlatUserSolutionNode(username, exerciseId, nodeId, _, _, _, _, _)                        = context.value
    val AnnotationInput(errorType, importance, startIndex, endIndex, text /*, annotationType*/ ) = context.arg(annotationArgument)

    for {
      annotationId <- context.arg(maybeAnnotationIdArgument) match {
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
      Field("submitMatch", SolutionNodeMatchGraphQLTypes.queryType, arguments = sampleSolutionNodeIdArgument :: Nil, resolve = resolveMatchWithSampleNode),
      Field("deleteMatch", BooleanType, arguments = sampleSolutionNodeIdArgument :: Nil, resolve = resolveDeleteMatch),
      Field(
        "upsertAnnotation",
        AnnotationGraphQLTypes.queryType,
        arguments = maybeAnnotationIdArgument :: annotationArgument :: Nil,
        resolve = resolveUpsertAnnotation
      ),
      Field("annotation", OptionType(AnnotationGraphQLTypes.mutationType), arguments = annotationIdArgument :: Nil, resolve = resolveAnnotation)
    )
  )

}
