package model

import model.graphql.GraphQLContext
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType, deriveObjectType}
import sangria.schema.{EnumType, InputObjectType, ObjectType}

import scala.concurrent.Future

case class SolutionNodeSubText(
  text: String,
  applicability: Applicability
)

object SolutionNodeSubText {

  type AnalyzedSampleSubText = (Int, Int, Int, String, Applicability)
  type AnalyzedUserSubText   = (String, Int, Int, Int, String, Applicability)

  val jsonFormat: OFormat[SolutionNodeSubText] = Json.format

  private implicit val x: EnumType[Applicability] = Applicability.graphQLType

  val queryType: ObjectType[GraphQLContext, SolutionNodeSubText] = deriveObjectType()

  val inputType: InputObjectType[SolutionNodeSubText] = deriveInputObjectType(
    InputObjectTypeName("SolutionNodeSubTextInput")
  )

}

trait NodeSubTextRepo {
  self: TableDefs =>

  import profile.api._

  protected val sampleSubTextsTQ = TableQuery[SampleSubTextsTable]
  protected val userSubTextsTQ   = TableQuery[UserSubTextsTable]

  private type QueryResult = (String, Applicability)

  private def applyQueryResults(results: Seq[QueryResult]): Seq[SolutionNodeSubText] = results.map { case (text, applicability) =>
    SolutionNodeSubText(text, applicability)
  }

  def futureSubTextsForSampleSolutionEntry(exerciseId: Int, entryId: Int): Future[Seq[SolutionNodeSubText]] = for {
    queryResult <- db.run(
      sampleSubTextsTQ
        .filter { subText => subText.exerciseId === exerciseId && subText.nodeId === entryId }
        .map { subText => (subText.text, subText.applicability) }
        .result
    )
  } yield applyQueryResults(queryResult)

  def futureSubTextsForSampleSolution(exerciseId: Int): Future[Seq[(Int, String, Applicability)]] = db.run(
    sampleSubTextsTQ
      .filter { _.exerciseId === exerciseId }
      .map { subText => (subText.nodeId, subText.text, subText.applicability) }
      .result
  )

  def futureSubTextsForUserSolutionEntry(username: String, exerciseId: Int, entryId: Int): Future[Seq[SolutionNodeSubText]] = for {
    queryResult <- db.run(
      userSubTextsTQ
        .filter { subText => subText.exerciseId === exerciseId && subText.username === username && subText.nodeId === entryId }
        .map { subText => (subText.text, subText.applicability) }
        .result
    )
  } yield applyQueryResults(queryResult)

  def futureSubTextsForUserSolution(username: String, exerciseId: Int): Future[Seq[(Int, String, Applicability)]] = db.run(
    userSubTextsTQ
      .filter { subText => subText.exerciseId === exerciseId && subText.username === username }
      .map { subText => (subText.nodeId, subText.text, subText.applicability) }
      .result
  )

  protected abstract class SubTextsTable[T](tag: Tag, name: String) extends Table[T](tag, s"${name}_solution_node_sub_texts") {

    def exerciseId = column[Int]("exercise_id")

    def nodeId = column[Int]("node_id")

    def id = column[Int]("id")

    def text = column[String]("node_text")

    def applicability = column[Applicability]("applicability")

  }

  protected class SampleSubTextsTable(tag: Tag) extends SubTextsTable[SolutionNodeSubText.AnalyzedSampleSubText](tag, "sample") {

    def pk = primaryKey("sample_solution_node_sub_texts_pk", (exerciseId, nodeId, id))

    def sampleSolutionNodeFk =
      foreignKey("sample_solution_sub_text_node_fk", (exerciseId, nodeId), flatSampleSolutionNodesTableTQ)(
        node => (node.exerciseId, node.id),
        onUpdate = ForeignKeyAction.Cascade,
        onDelete = ForeignKeyAction.Cascade
      )

    override def * = (exerciseId, nodeId, id, text, applicability)

  }

  protected class UserSubTextsTable(tag: Tag) extends SubTextsTable[SolutionNodeSubText.AnalyzedUserSubText](tag, "user") {

    def username = column[String]("username")

    def pk = primaryKey("user_solution_node_sub_texts_pk", (exerciseId, username, nodeId, id))

    def userSolutionNodeFk = foreignKey("user_solution_sub_text_node_fk", (username, exerciseId, nodeId), flatUserSolutionNodesTableTQ)(
      node => (node.username, node.exerciseId, node.id),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (username, exerciseId, nodeId, id, text, applicability)

  }

}
