package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.macros.derive._
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

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

object AnnotationGraphQLTypes extends GraphQLBasics:
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

trait AnnotationRepository:
  self: TableDefs =>

  import profile.api._

  protected object annotationsTQ extends TableQuery[UserSolutionNodeAnnotationsTable](new UserSolutionNodeAnnotationsTable(_)) {
    def forNode(username: String, exerciseId: Int, nodeId: Int): Query[UserSolutionNodeAnnotationsTable, DbAnnotation, Seq] = this.filter { anno =>
      anno.username === username && anno.exerciseId === exerciseId && anno.userNodeId === nodeId
    }

    def byId(username: String, exerciseId: Int, nodeId: Int, id: Int): Query[UserSolutionNodeAnnotationsTable, DbAnnotation, Seq] = this.filter { a =>
      a.username === username && a.exerciseId === exerciseId && a.userNodeId === nodeId && a.id === id
    }
  }

  def futureNextAnnotationId(username: String, exerciseId: Int, nodeId: Int): Future[Int] = for {
    maybeMaxId <- db.run { annotationsTQ.forNode(username, exerciseId, nodeId).map(_.id).max.result }
  } yield maybeMaxId.map { _ + 1 }.getOrElse { 0 }

  def futureAnnotationsForUserSolutionNode(username: String, exerciseId: Int, nodeId: Int): Future[Seq[DbAnnotation]] =
    db.run { annotationsTQ.forNode(username, exerciseId, nodeId).sortBy { _.startIndex }.result }

  def futureUpsertAnnotation(annotation: DbAnnotation): Future[Unit] = for {
    _ <- db.run { annotationsTQ.insertOrUpdate(annotation) }
  } yield ()

  def futureMaybeAnnotationById(username: String, exerciseId: Int, nodeId: Int, annotationId: Int): Future[Option[DbAnnotation]] =
    db.run { annotationsTQ.byId(username, exerciseId, nodeId, annotationId).result.headOption }

  def futureDeleteAnnotation(username: String, exerciseId: Int, nodeId: Int, annotationId: Int): Future[Unit] = for {
    _ <- db.run { annotationsTQ.byId(username, exerciseId, nodeId, annotationId).delete }
  } yield ()

  protected class UserSolutionNodeAnnotationsTable(tag: Tag) extends HasForeignKeyOnUserSolutionNodeTable[DbAnnotation](tag, "user_solution_node_annotations"):
    def id             = column[Int]("id")
    def errorType      = column[ErrorType]("error_type")
    def importance     = column[AnnotationImportance]("importance")
    def startIndex     = column[Int]("start_index")
    def endIndex       = column[Int]("end_index")
    def text           = column[String]("text")
    def annotationType = column[AnnotationType]("annotation_type")

    def pk = primaryKey("user_solution_node_annotations_pk", (username, exerciseId, userNodeId, id))

    override def * = (username, exerciseId, userNodeId, id, errorType, importance, startIndex, endIndex, text, annotationType).mapTo[DbAnnotation]
