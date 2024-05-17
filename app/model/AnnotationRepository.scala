package model

import scala.concurrent.Future

trait AnnotationRepository {
  self: TableDefs =>

  import profile.api._

  protected object annotationsTQ extends TableQuery[UserSolutionNodeAnnotationsTable](new UserSolutionNodeAnnotationsTable(_)) {
    def forNode(username: String, exerciseId: Int, nodeId: Int): Query[UserSolutionNodeAnnotationsTable, Annotation, Seq] = this.filter { anno =>
      anno.username === username && anno.exerciseId === exerciseId && anno.userNodeId === nodeId
    }

    def byKey(key: AnnotationKey) = this.filter { a =>
      a.username === key.username && a.exerciseId === key.exerciseId && a.userNodeId === key.nodeId && a.id === key.id
    }
  }

  def futureNextAnnotationId(username: String, exerciseId: Int, nodeId: Int): Future[Int] = for {
    maybeMaxId <- db.run { annotationsTQ.forNode(username, exerciseId, nodeId).map(_.id).max.result }
  } yield maybeMaxId.map { _ + 1 }.getOrElse { 0 }

  def futureAnnotationsForUserSolutionNode(username: String, exerciseId: Int, nodeId: Int): Future[Seq[Annotation]] = db.run {
    annotationsTQ.forNode(username, exerciseId, nodeId).sortBy { _.startIndex }.result
  }

  def futureUpsertAnnotation(annotation: Annotation): Future[Unit] = for {
    _ <- db.run { annotationsTQ.insertOrUpdate(annotation) }
  } yield ()

  def futureMaybeAnnotationById(key: AnnotationKey): Future[Option[Annotation]] = db.run { annotationsTQ.byKey(key).result.headOption }

  def futureDeleteAnnotation(key: AnnotationKey): Future[Unit] = for {
    _ <- db.run { annotationsTQ.byKey { key }.delete }
  } yield ()

  protected class UserSolutionNodeAnnotationsTable(tag: Tag) extends Table[Annotation](tag, "user_solution_node_annotations") {
    def username       = column[String]("username")
    def exerciseId     = column[Int]("exercise_id")
    def userNodeId     = column[Int]("user_node_id")
    def id             = column[Int]("id")
    def errorType      = column[ErrorType]("error_type")
    def importance     = column[AnnotationImportance]("importance")
    def startIndex     = column[Int]("start_index")
    def endIndex       = column[Int]("end_index")
    def text           = column[String]("text")
    def annotationType = column[AnnotationType]("annotation_type")

    def pk = primaryKey("user_solution_node_annotations_pk", (username, exerciseId, userNodeId, id))
    def userNodeFk = foreignKey("user_node_fk", (username, exerciseId, userNodeId), userSolutionNodesTQ)(
      node => (node.username, node.exerciseId, node.id),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * = (username, exerciseId, userNodeId, id, errorType, importance, startIndex, endIndex, text, annotationType).mapTo[Annotation]
  }
}
