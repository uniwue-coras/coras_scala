package model

import model.graphql.{GraphQLContext, Resolver}
import sangria.schema._

import scala.concurrent.ExecutionContext

trait Annotation:
  def id: Int
  def errorType: ErrorType
  def importance: AnnotationImportance
  def startIndex: Int
  def endIndex: Int
  def text: String
  def annotationType: AnnotationType

final case class DbAnnotation(
  username: String,
  exerciseId: Int,
  nodeId: Int,
  id: Int,
  errorType: ErrorType,
  importance: AnnotationImportance,
  startIndex: Int,
  endIndex: Int,
  text: String,
  annotationType: AnnotationType
) extends Annotation

object Annotation:

  val y = ObjectType[GraphQLContext, (_, Annotation)](
    "XYZ",
    fields[GraphQLContext, (_, Annotation)]()
  )

  val queryType = ObjectType[GraphQLContext, Annotation](
    "Annotation",
    fields[GraphQLContext, Annotation](
      Field("id", IntType, resolve = _.value.id),
      Field("errorType", ErrorType.graphQLType, resolve = _.value.errorType),
      Field("importance", AnnotationImportance.graphQLType, resolve = _.value.importance),
      Field("startIndex", IntType, resolve = _.value.startIndex),
      Field("endIndex", IntType, resolve = _.value.endIndex),
      Field("text", StringType, resolve = _.value.text),
      Field("annotationType", AnnotationType.graphQLType, resolve = _.value.annotationType)
    )
  )

  private val resolveDeleteAnnotation: Resolver[DbAnnotation, Int] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    for {
      _ <- context.ctx.tableDefs.futureDeleteAnnotation(context.value.username, context.value.exerciseId, context.value.nodeId, context.value.id)
    } yield context.value.id
  }

  // TODO: reject automated annotation!
  private val resolveRejectAnnotation: Resolver[DbAnnotation, Boolean] = _ => ???

  val mutationType: ObjectType[GraphQLContext, DbAnnotation] = ObjectType(
    "AnnotationMutations",
    fields[GraphQLContext, DbAnnotation](
      Field("delete", IntType, resolve = resolveDeleteAnnotation),
      Field("reject", BooleanType, resolve = resolveRejectAnnotation)
    )
  )
