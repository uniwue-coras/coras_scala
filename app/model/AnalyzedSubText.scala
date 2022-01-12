package model

import model.graphql.GraphQLContext
import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType, deriveObjectType}
import sangria.schema.{EnumType, InputObjectType, ObjectType}

import scala.concurrent.Future

case class AnalyzedSubText(
  text: String,
  applicability: Applicability
)

object AnalyzedSubText {

  type AnalyzedSampleSubText = (Int, Int, Int, String, Applicability)
  type AnalyzedUserSubText   = (Int, String, Int, Int, String, Applicability)

  private implicit val x: EnumType[Applicability] = Applicability.graphQLType

  val queryType: ObjectType[GraphQLContext, AnalyzedSubText] = deriveObjectType()

  val inputType: InputObjectType[AnalyzedSubText] = deriveInputObjectType(
    InputObjectTypeName("AnalyzedSubTextInput")
  )

}

trait AnalyzedSubTextRepo {
  self: TableDefs =>

  import profile.api._

  protected val sampleSubTextsTQ = TableQuery[SampleSubTextsTable]
  protected val userSubTextsTQ   = TableQuery[UserSubTextsTable]

  private type QueryResult = (String, Applicability)

  private def applyQueryResults(results: Seq[QueryResult]): Seq[AnalyzedSubText] = results.map { case (text, applicability) =>
    AnalyzedSubText(text, applicability)
  }

  def futureSubTextsForSampleSolutionEntry(exerciseId: Int, entryId: Int): Future[Seq[AnalyzedSubText]] = for {
    queryResult <- db.run(
      sampleSubTextsTQ
        .filter(subText => subText.exerciseId === exerciseId && subText.entryId === entryId)
        .map(subText => (subText.text, subText.applicability))
        .result
    )
  } yield applyQueryResults(queryResult)

  def futureSubTextsForUserSolutionEntry(exerciseId: Int, username: String, entryId: Int): Future[Seq[AnalyzedSubText]] = for {
    queryResult <- db.run(
      userSubTextsTQ
        .filter(subText => subText.exerciseId === exerciseId && subText.username === username && subText.entryId === entryId)
        .map(subText => (subText.text, subText.applicability))
        .result
    )
  } yield applyQueryResults(queryResult)

  protected abstract class SubTextsTable[T](tag: Tag, name: String) extends Table[T](tag, s"${name}_solution_entry_sub_texts") {

    def exerciseId = column[Int]("exercise_id")

    def entryId = column[Int]("entry_id")

    def id = column[Int]("id")

    def text = column[String]("text")

    def applicability = column[Applicability]("applicability")

  }

  protected class SampleSubTextsTable(tag: Tag) extends SubTextsTable[AnalyzedSubText.AnalyzedSampleSubText](tag, "sample") {

    def pk = primaryKey("sample_solution_entry_sub_texts_pk", (exerciseId, entryId, id))

    override def * = (exerciseId, entryId, id, text, applicability)

  }

  protected class UserSubTextsTable(tag: Tag) extends SubTextsTable[AnalyzedSubText.AnalyzedUserSubText](tag, "user") {

    def username = column[String]("username")

    def pk = primaryKey("user_solution_entry_sub_texts_pk", (exerciseId, username, entryId, id))

    def user = foreignKey("user_fk", username, usersTQ)(_.username, onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade)

    override def * = (exerciseId, username, entryId, id, text, applicability)

  }

}
