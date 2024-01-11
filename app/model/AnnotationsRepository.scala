package model

import scala.concurrent.Future

trait AnnotationRepository:
  self: TableDefs =>

  import profile.api._

  protected object annotationsTQ extends TableQuery[UserSolutionNodeAnnotationsTable](new UserSolutionNodeAnnotationsTable(_)):
    def forNode(username: String, exerciseId: Int, nodeId: Int) = this.filter { anno =>
      anno.username === username && anno.exerciseId === exerciseId && anno.userNodeId === nodeId
    }

    def byId(username: String, exerciseId: Int, nodeId: Int, id: Int) = this.filter { anno =>
      anno.username === username && anno.exerciseId === exerciseId && anno.userNodeId === nodeId && anno.id === id
    }

  protected val userSubTextNodeAnnotationsTQ = TableQuery[UserSubTextNodeAnnotationsTable]

  def futureNextAnnotationId(username: String, exerciseId: Int, nodeId: Int): Future[Int] = for {
    maybeMaxId <- db.run { annotationsTQ.forNode(username, exerciseId, nodeId).map(_.id).max.result }
  } yield maybeMaxId.map { _ + 1 }.getOrElse { 0 }

  def futureAnnotationsForUserSolutionNode(username: String, exerciseId: Int, nodeId: Int): Future[Seq[(NodeAnnotationKey, Annotation)]] =
    db.run { annotationsTQ.forNode(username, exerciseId, nodeId).sortBy { _.startIndex }.result }

  def futureUpsertAnnotation(key: NodeAnnotationKey, annotation: Annotation): Future[Unit] = for {
    _ <- db.run { annotationsTQ insertOrUpdate (key, annotation) }
  } yield ()

  def futureMaybeAnnotationById(username: String, exerciseId: Int, nodeId: Int, annotationId: Int): Future[Option[(NodeAnnotationKey, Annotation)]] =
    db.run { annotationsTQ.byId(username, exerciseId, nodeId, annotationId).result.headOption }

  def futureDeleteAnnotation(username: String, exerciseId: Int, nodeId: Int, annotationId: Int): Future[Unit] = for {
    _ <- db.run { annotationsTQ.byId(username, exerciseId, nodeId, annotationId).delete }
  } yield ()

  def futureAnnotationsForSubTextNode(
    username: String,
    exerciseId: Int,
    parentNodeId: Int,
    subTextNodeId: Int
  ): Future[Seq[(UserSubTextNodeAnnotationKey, Annotation)]] =
    db.run {
      userSubTextNodeAnnotationsTQ.filter { anno =>
        anno.username === username && anno.exerciseId === exerciseId && anno.parentNodeId === parentNodeId && anno.subTextNodeId === subTextNodeId
      }.result
    }

  protected abstract class AnnotationsTable[K <: AnnotationKey](tag: Tag, tableName: String) extends Table[(K, Annotation)](tag, tableName):
    def id             = column[Int]("id")
    def errorType      = column[ErrorType]("error_type")
    def importance     = column[AnnotationImportance]("importance")
    def startIndex     = column[Int]("start_index")
    def endIndex       = column[Int]("end_index")
    def text           = column[String]("text")
    def annotationType = column[AnnotationType]("annotation_type")

    def annoFields = (id, errorType, importance, startIndex, endIndex, text, annotationType)

  protected class UserSolutionNodeAnnotationsTable(tag: Tag) extends AnnotationsTable[NodeAnnotationKey](tag, "user_solution_node_annotations"):
    def username   = column[String]("username")
    def exerciseId = column[Int]("exercise_id")
    def userNodeId = column[Int]("user_node_id")

    def pk = primaryKey("user_solution_node_annotations_pk", (username, exerciseId, userNodeId, id))
    def userNodeFk = foreignKey("user_node_fk", (username, exerciseId, userNodeId), userSolutionNodesTQ)(
      node => (node.username, node.exerciseId, node.id),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (
      (username, exerciseId, userNodeId).mapTo[NodeAnnotationKey],
      (id, errorType, importance, startIndex, endIndex, text, annotationType).mapTo[Annotation]
    ).mapTo[(NodeAnnotationKey, Annotation)]

  protected class UserSubTextNodeAnnotationsTable(tag: Tag) extends AnnotationsTable[UserSubTextNodeAnnotationKey](tag, "sub_text_node_annotations"):
    def username      = column[String]("username")
    def exerciseId    = column[Int]("exercise_id")
    def parentNodeId  = column[Int]("parent_node_id")
    def subTextNodeId = column[Int]("sub_text_node_id")

    def pk = primaryKey("sub_text_node_annotations_pk", (username, exerciseId, parentNodeId, subTextNodeId, id))
    // TODO: define fk!
    // val subTextNodeFk = ???

    override def * = (
      (username, exerciseId, parentNodeId, subTextNodeId).mapTo[UserSubTextNodeAnnotationKey],
      (id, errorType, importance, startIndex, endIndex, text, annotationType).mapTo[Annotation]
    )
