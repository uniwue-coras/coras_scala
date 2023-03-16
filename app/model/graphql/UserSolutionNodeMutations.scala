package model.graphql

import model.{Annotation, AnnotationGraphQLTypes, AnnotationInput, FlatUserSolutionNode}
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

trait UserSolutionNodeMutations extends GraphQLArguments with GraphQLBasics with AnnotationGraphQLTypes {

  protected implicit val ec: ExecutionContext

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

  private val resolveDeleteAnnotation: Resolver[FlatUserSolutionNode, Int] = context => {
    val FlatUserSolutionNode(username, exerciseId, nodeId, _, _, _, _, _) = context.value

    val annotationId = context.arg(annotationIdArgument)

    for {
      _ <- context.ctx.tableDefs.futureDeleteAnnotation(username, exerciseId, nodeId, annotationId)
    } yield annotationId
  }

  protected val userSolutionNodeMutationType: ObjectType[GraphQLContext, FlatUserSolutionNode] = ObjectType(
    "UserSolutionNode",
    fields[GraphQLContext, FlatUserSolutionNode](
      Field("deleteAnnotation", IntType, arguments = annotationIdArgument :: Nil, resolve = resolveDeleteAnnotation),
      Field("upsertAnnotation", annotationGraphQLType, arguments = maybeAnnotationIdArgument :: annotationArgument :: Nil, resolve = resolveUpsertAnnotation)
    )
  )

}
