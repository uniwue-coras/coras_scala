package model

import scala.annotation.unused
import scala.concurrent.Future

trait IAnnotation {
  val errorType: ErrorType
  val importance: AnnotationImportance
  val startIndex: Int
  val endIndex: Int
  val text: String
}

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
) extends IAnnotation

final case class AnnotationInput(
  errorType: ErrorType,
  importance: AnnotationImportance,
  startIndex: Int,
  endIndex: Int,
  text: String
) extends IAnnotation

trait AnnotationRepository {
  self: TableDefs =>

  import profile.api._

  protected object annotationsTQ extends TableQuery[UserSolutionNodeAnnotationsTable](new UserSolutionNodeAnnotationsTable(_)) {
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
    def username               = column[String]("username")
    def exerciseId             = column[Int]("exercise_id")
    def userNodeId             = column[Int]("user_node_id")
    def id                     = column[Int]("id")
    private def errorType      = column[ErrorType]("error_type")
    private def importance     = column[AnnotationImportance]("importance")
    def startIndex             = column[Int]("start_index")
    def endIndex               = column[Int]("end_index")
    def text                   = column[String]("text")
    private def annotationType = column[AnnotationType]("annotation_type")

    @unused def pk = primaryKey("user_solution_node_annotations_pk", (username, exerciseId, userNodeId, id))

    @unused def nodeFk = foreignKey("user_node_fk", (username, exerciseId, userNodeId), userSolutionNodesTQ)(
      node => (node.username, node.exerciseId, node.id),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * =
      (username, exerciseId, userNodeId, id, errorType, importance, startIndex, endIndex, text, annotationType) <> (Annotation.tupled, Annotation.unapply)
  }

}
