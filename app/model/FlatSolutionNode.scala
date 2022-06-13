package model

import model.graphql.GraphQLContext
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive._
import sangria.schema._

import scala.concurrent.Future

final case class FlatSolutionNode(
  username: Option[String],
  exerciseId: Int,
  id: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
)

final case class FlatSolutionNodeInput(
  id: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  subTexts: Seq[SolutionNodeSubText]
) extends FlatTreeNode

object FlatSolutionNode {

  type FlatSampleSolutionEntry = (Int, Int, String, Applicability, Option[Int])
  type FlatUserSolutionEntry   = (String, Int, Int, String, Applicability, Option[Int])

  val queryType: ObjectType[GraphQLContext, FlatSolutionNode] = {
    implicit val x: EnumType[Applicability] = Applicability.graphQLType

    deriveObjectType(
      ExcludeFields("exerciseId", "username"),
      AddFields(
        Field(
          "subTexts",
          ListType(SolutionNodeSubText.queryType),
          resolve = { case Context(value, ctx, _, _, _, _, _, _, _, _, _, _, _, _) =>
            value.username match {
              case None           => ctx.tableDefs.futureSubTextsForSampleSolutionEntry(value.exerciseId, value.id)
              case Some(username) => ctx.tableDefs.futureSubTextsForUserSolutionEntry(username, value.exerciseId, value.id)
            }
          }
        )
      )
    )
  }

  val inputType: InputObjectType[FlatSolutionNodeInput] = {
    implicit val x0: InputType[Applicability]             = Applicability.graphQLType
    implicit val x1: InputObjectType[SolutionNodeSubText] = deriveInputObjectType(InputObjectTypeName("SolutionEntrySubTextInput"))

    deriveInputObjectType()
  }

  val inputJsonFormat: OFormat[FlatSolutionNodeInput] = {
    implicit val x0: OFormat[SolutionNodeSubText] = Json.format

    Json.format
  }

}

trait FlatSolutionNodeRepo {
  self: TableDefs =>

  import profile.api._

  protected val flatSampleSolutionNodesTableTQ = TableQuery[FlatSampleSolutionNodeTable]
  protected val flatUserSolutionNodesTableTQ   = TableQuery[FlatUserSolutionNodeTable]

  private type QueryResultType = (Int, String, Applicability, Option[Int])

  private def applyNode(exerciseId: Int, username: Option[String], nodes: Seq[QueryResultType]): Seq[FlatSolutionNode] = nodes.map {
    case (id, text, applicability, parentId) => FlatSolutionNode(username, exerciseId, id, text, applicability, parentId)
  }

  def futureSampleSolutionForExercise(exerciseId: Int): Future[Seq[FlatSolutionNode]] = for {
    entriesResult <- db.run(
      flatSampleSolutionNodesTableTQ
        .filter { _.exerciseId === exerciseId }
        .map { node => (node.id, node.text, node.applicability, node.parentId) }
        .result
    )
  } yield applyNode(exerciseId, None, entriesResult)

  def futureUserHasSubmittedSolution(exerciseId: Int, username: String): Future[Boolean] = db.run(
    flatUserSolutionNodesTableTQ
      .filter { node => node.exerciseId === exerciseId && node.username === username }
      .length
      .result
      .map { _ > 0 }
  )

  def futureUsersWithSolution(exerciseId: Int): Future[Seq[String]] = db.run(
    flatUserSolutionNodesTableTQ
      .filter { _.exerciseId === exerciseId }
      .map { _.username }
      .distinct
      .result
  )

  def futureUserSolutionForExercise(exerciseId: Int, username: String): Future[Seq[FlatSolutionNode]] = for {
    entriesResult <- db.run(
      flatUserSolutionNodesTableTQ
        .filter { node => node.exerciseId === exerciseId && node.username === username }
        .map { node => (node.id, node.text, node.applicability, node.parentId) }
        .result
    )
  } yield applyNode(exerciseId, Some(username), entriesResult)

  protected abstract class FlatSolutionNodesTable[T](tag: Tag, name: String) extends Table[T](tag, s"${name}_solution_nodes") {

    def exerciseId = column[Int]("exercise_id")

    def id = column[Int]("id")

    def text = column[String]("node_text")

    def applicability = column[Applicability]("applicability")

    def parentId = column[Option[Int]]("parent_id")

    def exercise = foreignKey(s"${name}_exercise_fk", exerciseId, exercisesTQ)(_.id, onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade)

  }

  protected class FlatSampleSolutionNodeTable(tag: Tag) extends FlatSolutionNodesTable[FlatSolutionNode.FlatSampleSolutionEntry](tag, "sample") {

    def pk = primaryKey("sample_solution_nodes_pk", (exerciseId, id))

    override def * = (exerciseId, id, text, applicability, parentId)

  }

  protected class FlatUserSolutionNodeTable(tag: Tag) extends FlatSolutionNodesTable[FlatSolutionNode.FlatUserSolutionEntry](tag, "user") {

    def username = column[String]("username", O.PrimaryKey)

    def pk = primaryKey("user_solution_nodes_pk", (exerciseId, username, id))

    def user =
      foreignKey("user_solution_nodes_user_fk", username, usersTQ)(_.username, onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade)

    override def * = (username, exerciseId, id, text, applicability, parentId)

  }

}
