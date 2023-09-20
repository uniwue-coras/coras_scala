package model

import de.uniwue.ls6.corasModel.{AnnotationImportance, AnnotationType, ErrorType, ExportedAnnotation}
import model.graphql.{GraphQLContext, MutationType, MyInputType, QueryType}
import sangria.macros.derive.{ExcludeFields, deriveEnumType, deriveInputObjectType, deriveObjectType}
import sangria.schema.{BooleanType, EnumType, Field, InputObjectType, IntType, ObjectType, fields}

import scala.annotation.unused
import scala.concurrent.{ExecutionContext, Future}

final case class Annotation(
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
) extends LeafExportable[ExportedAnnotation] {

  override def exportData: ExportedAnnotation = ExportedAnnotation(id, errorType, importance, startIndex, endIndex, text, annotationType)

}

final case class AnnotationInput(
  errorType: ErrorType,
  importance: AnnotationImportance,
  startIndex: Int,
  endIndex: Int,
  text: String
)

object AnnotationGraphQLTypes extends QueryType[Annotation] with MutationType[Annotation] with MyInputType[AnnotationInput] {

  @unused private implicit val errorTypeType: EnumType[ErrorType]                       = deriveEnumType()
  @unused private implicit val annotationTypeType: EnumType[AnnotationType]             = deriveEnumType()
  @unused private implicit val annotationImportanceType: EnumType[AnnotationImportance] = deriveEnumType()

  override val inputType: InputObjectType[AnnotationInput] = deriveInputObjectType()

  override val queryType: ObjectType[GraphQLContext, Annotation] = deriveObjectType(
    ExcludeFields("username", "exerciseId", "nodeId")
  )

  private val resolveDeleteAnnotation: Resolver[Annotation, Int] = context => {
    @unused implicit val ec: ExecutionContext = context.ctx.ec

    for {
      _ <- context.ctx.tableDefs.futureDeleteAnnotation(context.value.username, context.value.exerciseId, context.value.nodeId, context.value.id)
    } yield context.value.id
  }

  private val resolveRejectAnnotation: Resolver[Annotation, Boolean] = context => {
    // TODO: reject automated annotation!

    ???
  }

  override val mutationType: ObjectType[GraphQLContext, Annotation] = ObjectType(
    "AnnotationMutations",
    fields[GraphQLContext, Annotation](
      Field("delete", IntType, resolve = resolveDeleteAnnotation),
      Field("reject", BooleanType, resolve = resolveRejectAnnotation)
    )
  )

}

trait AnnotationRepository {
  self: TableDefs =>

  import profile.api._

  protected object annotationsTQ extends TableQuery[UserSolutionNodeAnnotationsTable](new UserSolutionNodeAnnotationsTable(_)) {
    def forNode(username: String, exerciseId: Int, nodeId: Int): Query[UserSolutionNodeAnnotationsTable, Annotation, Seq] = this.filter { anno =>
      anno.username === username && anno.exerciseId === exerciseId && anno.userNodeId === nodeId
    }

    def byId(username: String, exerciseId: Int, nodeId: Int, id: Int): Query[UserSolutionNodeAnnotationsTable, Annotation, Seq] = this.filter { a =>
      a.username === username && a.exerciseId === exerciseId && a.userNodeId === nodeId && a.id === id
    }
  }

  def futureNextAnnotationId(username: String, exerciseId: Int, nodeId: Int): Future[Int] = for {
    maybeMaxId <- db.run { annotationsTQ.forNode(username, exerciseId, nodeId).map(_.id).max.result }
  } yield maybeMaxId.map { _ + 1 }.getOrElse { 0 }

  def futureAnnotationsForUserSolutionNode(username: String, exerciseId: Int, nodeId: Int): Future[Seq[Annotation]] =
    db.run { annotationsTQ.forNode(username, exerciseId, nodeId).sortBy { _.startIndex }.result }

  def futureUpsertAnnotation(annotation: Annotation): Future[Unit] = for {
    _ <- db.run { annotationsTQ.insertOrUpdate(annotation) }
  } yield ()

  def futureMaybeAnnotationById(username: String, exerciseId: Int, nodeId: Int, annotationId: Int): Future[Option[Annotation]] =
    db.run { annotationsTQ.byId(username, exerciseId, nodeId, annotationId).result.headOption }

  def futureDeleteAnnotation(username: String, exerciseId: Int, nodeId: Int, annotationId: Int): Future[Unit] = for {
    _ <- db.run { annotationsTQ.byId(username, exerciseId, nodeId, annotationId).delete }
  } yield ()

  protected class UserSolutionNodeAnnotationsTable(tag: Tag) extends HasForeignKeyOnUserSolutionNodeTable[Annotation](tag, "user_solution_node_annotations") {
    def id                     = column[Int]("id")
    private def errorType      = column[ErrorType]("error_type")
    private def importance     = column[AnnotationImportance]("importance")
    def startIndex             = column[Int]("start_index")
    private def endIndex       = column[Int]("end_index")
    private def text           = column[String]("text")
    private def annotationType = column[AnnotationType]("annotation_type")

    @unused def pk = primaryKey("user_solution_node_annotations_pk", (username, exerciseId, userNodeId, id))

    override def * =
      (username, exerciseId, userNodeId, id, errorType, importance, startIndex, endIndex, text, annotationType) <> (Annotation.tupled, Annotation.unapply)
  }

}
