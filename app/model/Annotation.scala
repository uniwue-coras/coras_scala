package model

import model.graphql.{GraphQLContext, Resolver}
import sangria.schema._

import scala.concurrent.ExecutionContext

final case class Annotation(
  id: Int,
  errorType: ErrorType,
  importance: AnnotationImportance,
  startIndex: Int,
  endIndex: Int,
  text: String,
  annotationType: AnnotationType
)

sealed trait AnnotationKey

type DbNodeAnnotation = (NodeAnnotationKey, Annotation)

final case class NodeAnnotationKey(
  username: String,
  exerciseId: Int,
  nodeId: Int
) extends AnnotationKey

final case class UserSubTextNodeAnnotationKey(
  username: String,
  exerciseId: Int,
  parentNodeId: Int,
  subTextNodeId: Int
) extends AnnotationKey

object Annotation:
  val queryType = ObjectType[GraphQLContext, (AnnotationKey, Annotation)](
    "Annotation",
    fields[GraphQLContext, (AnnotationKey, Annotation)](
      Field("id", IntType, resolve = _.value._2.id),
      Field("errorType", ErrorType.graphQLType, resolve = _.value._2.errorType),
      Field("importance", AnnotationImportance.graphQLType, resolve = _.value._2.importance),
      Field("startIndex", IntType, resolve = _.value._2.startIndex),
      Field("endIndex", IntType, resolve = _.value._2.endIndex),
      Field("text", StringType, resolve = _.value._2.text),
      Field("annotationType", AnnotationType.graphQLType, resolve = _.value._2.annotationType)
    )
  )

  private val resolveDeleteAnnotation: Resolver[DbNodeAnnotation, Int] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    for {
      _ <- context.ctx.tableDefs.futureDeleteAnnotation(context.value._1.username, context.value._1.exerciseId, context.value._1.nodeId, context.value._2.id)
    } yield context.value._2.id
  }

  // TODO: reject automated annotation!
  private val resolveRejectAnnotation: Resolver[DbNodeAnnotation, Boolean] = _ => ???

  val mutationType: ObjectType[GraphQLContext, DbNodeAnnotation] = ObjectType(
    "AnnotationMutations",
    fields[GraphQLContext, DbNodeAnnotation](
      Field("delete", IntType, resolve = resolveDeleteAnnotation),
      Field("reject", BooleanType, resolve = resolveRejectAnnotation)
    )
  )
