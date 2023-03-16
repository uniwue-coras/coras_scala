package model

import sangria.macros.derive.{ExcludeFields, deriveInputObjectType, deriveObjectType}
import sangria.schema.{EnumType, InputObjectType, ObjectType}
import slick.jdbc.JdbcType

import scala.concurrent.Future

final case class Annotation(
  username: String,
  exerciseId: Int,
  nodeId: Int,
  id: Int,
  errorType: ErrorType,
  startIndex: Int,
  endIndex: Int,
  text: String
)

final case class AnnotationInput(
  errorType: ErrorType,
  startIndex: Int,
  endIndex: Int,
  text: String
)

trait AnnotationGraphQLTypes {

  // noinspection ScalaUnusedSymbol
  private implicit val x0: EnumType[ErrorType] = ErrorType.graphQLEnumType

  protected val annotationGraphQLType: ObjectType[Unit, Annotation] = deriveObjectType(
    ExcludeFields("username", "exerciseId", "nodeId")
  )

  protected val annotationInputType: InputObjectType[AnnotationInput] = deriveInputObjectType()

}

trait AnnotationRepository {
  self: TableDefs =>

  import profile.api._

  private implicit val errorTypeType: JdbcType[ErrorType] = MappedColumnType.base[ErrorType, String](_.entryName, ErrorType.withNameInsensitive)

  private object annotationsTQ extends TableQuery[UserSolutionNodeAnnotationsTable](new UserSolutionNodeAnnotationsTable(_)) {
    def forNode(username: String, exerciseId: Int, nodeId: Int): Query[UserSolutionNodeAnnotationsTable, Annotation, Seq] = this.filter { anno =>
      anno.username === username && anno.exerciseId === exerciseId && anno.userNodeId === nodeId
    }
  }

  def futureNextAnnotationId(username: String, exerciseId: Int, nodeId: Int): Future[Int] = for {
    maybeMaxId <- db.run(
      annotationsTQ.forNode(username, exerciseId, nodeId).map(_.id).max.result
    )
  } yield maybeMaxId.map { _ + 1 }.getOrElse { 0 }

  def futureAnnotationsForUserSolutionNode(username: String, exerciseId: Int, nodeId: Int): Future[Seq[Annotation]] = db.run(
    annotationsTQ
      .forNode(username, exerciseId, nodeId)
      .sortBy { _.startIndex }
      .result
  )

  def futureUpsertAnnotation(annotation: Annotation): Future[Unit] = for {
    _ <- db.run(annotationsTQ.insertOrUpdate(annotation))
  } yield ()

  def futureDeleteAnnotation(username: String, exerciseId: Int, nodeId: Int, annotationId: Int): Future[Unit] = for {
    _ <- db.run(
      annotationsTQ.filter { anno =>
        anno.username === username && anno.exerciseId === exerciseId && anno.userNodeId === nodeId && anno.id === annotationId
      }.delete
    )
  } yield ()

  protected class UserSolutionNodeAnnotationsTable(tag: Tag) extends Table[Annotation](tag, "user_solution_node_annotations") {

    def username = column[String]("username")

    def exerciseId = column[Int]("exercise_id")

    def userNodeId = column[Int]("user_node_id")

    def id = column[Int]("id")

    def errorType = column[ErrorType]("error_type")

    def startIndex = column[Int]("start_index")

    def endIndex = column[Int]("end_index")

    def text = column[String]("text")

    // noinspection ScalaUnusedSymbol
    def pk = primaryKey("user_solution_node_annotations_pk", (username, exerciseId, userNodeId, id))

    // noinspection ScalaUnusedSymbol
    def nodeFk = foreignKey(
      "user_solution_node_annotations_user_solution_node_fk",
      (username, exerciseId, userNodeId),
      userSolutionNodesTQ
    )(
      node => (node.username, node.exerciseId, node.id),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (username, exerciseId, userNodeId, id, errorType, startIndex, endIndex, text) <> (Annotation.tupled, Annotation.unapply)

  }

}
