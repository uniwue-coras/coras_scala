package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.macros.derive._
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

final case class AnnotationInput(
  errorType: ErrorType,
  importance: AnnotationImportance,
  startIndex: Int,
  endIndex: Int,
  text: String
)

object Annotation extends GraphQLBasics:
  private implicit val errorTypeType: EnumType[ErrorType]                       = ErrorType.graphQLType
  private implicit val annotationTypeType: EnumType[AnnotationType]             = AnnotationType.graphQLType
  private implicit val annotationImportanceType: EnumType[AnnotationImportance] = AnnotationImportance.graphQLType

  val inputType: InputObjectType[AnnotationInput] = deriveInputObjectType()

  val queryType: ObjectType[GraphQLContext, DbAnnotation] = deriveObjectType(
    ObjectTypeName("Annotation"),
    ExcludeFields("username", "exerciseId", "nodeId")
  )

  private val resolveDeleteAnnotation: Resolver[DbAnnotation, Int] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    for {
      _ <- context.ctx.tableDefs.futureDeleteAnnotation(context.value.username, context.value.exerciseId, context.value.nodeId, context.value.id)
    } yield context.value.id
  }

  private val resolveRejectAnnotation: Resolver[DbAnnotation, Boolean] = _ => {
    // TODO: reject automated annotation!

    ???
  }

  val mutationType: ObjectType[GraphQLContext, DbAnnotation] = ObjectType(
    "AnnotationMutations",
    fields[GraphQLContext, DbAnnotation](
      Field("delete", IntType, resolve = resolveDeleteAnnotation),
      Field("reject", BooleanType, resolve = resolveRejectAnnotation)
    )
  )
