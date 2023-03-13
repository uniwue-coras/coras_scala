package model

import sangria.macros.derive.{ExcludeFields, deriveInputObjectType, deriveObjectType}
import sangria.schema.{EnumType, InputObjectType, ObjectType}
import slick.jdbc.JdbcType

import scala.concurrent.Future

final case class Annotation(
  username: String,
  exerciseId: Int,
  nodeId: Int,
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

  private val userSolutionNodeAnnotationsTQ: TableQuery[UserSolutionNodeAnnotationsTable] = TableQuery[UserSolutionNodeAnnotationsTable]

  def futureAnnotationsForUserSolutionNode(username: String, exerciseId: Int, nodeId: Int): Future[Seq[Annotation]] = db.run(
    userSolutionNodeAnnotationsTQ
      .filter { anno => anno.username === username && anno.exerciseId === exerciseId && anno.userNodeId === nodeId }
      .sortBy { _.startIndex }
      .result
  )

  protected class UserSolutionNodeAnnotationsTable(tag: Tag) extends Table[Annotation](tag, "user_solution_node_annotations") {

    def username = column[String]("username")

    def exerciseId = column[Int]("exercise_id")

    def userNodeId = column[Int]("user_node_id")

    def errorType = column[ErrorType]("error_type")

    def startIndex = column[Int]("start_index")

    def endIndex = column[Int]("end_index")

    def text = column[String]("text")

    // noinspection ScalaUnusedSymbol
    def pk = primaryKey("user_solution_node_annotations_pk", (username, exerciseId, userNodeId, startIndex, endIndex))

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

    override def * = (username, exerciseId, userNodeId, errorType, startIndex, endIndex, text) <> (Annotation.tupled, Annotation.unapply)

  }

}
