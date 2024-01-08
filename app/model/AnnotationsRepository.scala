package model

import scala.concurrent.Future

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
