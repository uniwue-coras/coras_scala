package model

import model.exporting.{ExportedAnnotation, LeafExportable}
import model.graphql.{GraphQLBasics, GraphQLContext}
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
    with LeafExportable[ExportedAnnotation]:
  override def exportData: ExportedAnnotation = new ExportedAnnotation(id, errorType, importance, startIndex, endIndex, text, annotationType)

object Annotation extends GraphQLBasics:
  val interfaceType = InterfaceType[GraphQLContext, Annotation](
    "IAnnotation",
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

  val queryType = ObjectType[GraphQLContext, DbAnnotation](
    "Annotation",
    interfaces[GraphQLContext, DbAnnotation](Annotation.interfaceType),
    Nil
  )

  private val resolveDeleteAnnotation: Resolver[DbAnnotation, Int] = unpackedResolver {
    case (GraphQLContext(tableDefs, _, _ec), DbAnnotation(username, exerciseId, nodeId, id, _, _, _, _, _, _)) =>
      implicit val ec: ExecutionContext = _ec

      for {
        _ <- tableDefs.futureDeleteAnnotation(username, exerciseId, nodeId, id)
      } yield id
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
