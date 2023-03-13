package model.graphql

import model.{Annotation, AnnotationGraphQLTypes, AnnotationInput, FlatUserSolutionNode}
import sangria.schema._

import scala.concurrent.ExecutionContext

trait UserSolutionNodeMutations extends GraphQLArguments with GraphQLBasics with AnnotationGraphQLTypes {

  protected implicit val ec: ExecutionContext

  private val resolveSubmitAnnotation: Resolver[FlatUserSolutionNode, Annotation] = context => {
    val AnnotationInput(errorType, startIndex, endIndex, text) = context.arg(annotationArgument)

    val FlatUserSolutionNode(username, exerciseId, nodeId, _, _, _, _, _) = context.value

    for {
      maybeNextAnnotationId <- context.ctx.tableDefs.futureNextAnnotationId(username, exerciseId, nodeId)

      annotationId = maybeNextAnnotationId.map { _ + 1 }.getOrElse { 0 }

      annotation = Annotation(username, exerciseId, nodeId, annotationId, errorType, startIndex, endIndex, text)

      _ <- context.ctx.tableDefs.futureInsertAnnotation(annotation)
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
      Field("submitAnnotation", annotationGraphQLType, arguments = annotationArgument :: Nil, resolve = resolveSubmitAnnotation),
      Field("deleteAnnotation", IntType, arguments = annotationIdArgument :: Nil, resolve = resolveDeleteAnnotation)
    )
  )

}
