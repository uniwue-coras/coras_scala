package model

final case class Annotation(
  username: String,
  exerciseId: Int,
  nodeId: Int,
  startIndex: Int,
  endIndex: Int,
  text: String
)

final case class AnnotationInput(
  startIndex: Int,
  endIndex: Int,
  text: String
)

trait AnnotationRepository {
  self: TableDefs =>

  import profile.api._

  protected class UserSolutionNodeAnnotationsTable(tag: Tag) extends Table[Annotation](tag, "user_solution_node_annotations") {

    def username = column[String]("username")

    def exerciseId = column[Int]("exercise_id")

    def userNodeId = column[Int]("user_node_id")

    def startIndex = column[Int]("start_index")

    def endIndex = column[Int]("end_index")

    def text = column[String]("text")

    def pk = primaryKey("user_solution_node_annotations_pk", (username, exerciseId, userNodeId, startIndex, endIndex))

    def nodeFk = foreignKey(
      "user_solution_node_annotations_user_solution_node_fk",
      (username, exerciseId, userNodeId),
      userSolutionNodesTQ
    )(
      node => (node.username, node.exerciseId, node.id),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (username, exerciseId, userNodeId, startIndex, endIndex, text) <> (Annotation.tupled, Annotation.unapply)

  }

}
