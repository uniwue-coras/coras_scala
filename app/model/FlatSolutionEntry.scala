package model

import model.graphql.GraphQLContext
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive._
import sangria.schema._

import scala.concurrent.Future

final case class FlatSolutionEntry(
  exerciseId: Int,
  username: Option[String],
  id: Int,
  text: String,
  applicability: Applicability,
  weight: Option[Int],
  priorityPoints: Option[Int],
  parentId: Option[Int]
)

final case class FlatSolutionEntryInput(
  id: Int,
  text: String,
  applicability: Applicability,
  weight: Option[Int],
  priorityPoints: Option[Int],
  parentId: Option[Int],
  subTexts: Seq[AnalyzedSubText],
  paragraphCitations: Seq[ParagraphCitationInput]
)

object FlatSolutionEntry {

  type FlatSampleSolutionEntry = (Int, Int, String, Applicability, Option[Int], Option[Int], Option[Int])
  type FlatUserSolutionEntry   = (Int, String, Int, String, Applicability, Option[Int], Option[Int], Option[Int])

  val queryType: ObjectType[GraphQLContext, FlatSolutionEntry] = {
    implicit val x: EnumType[Applicability] = Applicability.graphQLType

    deriveObjectType(
      ExcludeFields("exerciseId", "username"),
      AddFields(
        Field(
          "subTexts",
          ListType(AnalyzedSubText.queryType),
          resolve = { case Context(value, ctx, _, _, _, _, _, _, _, _, _, _, _, _) =>
            value.username match {
              case None           => ctx.tableDefs.futureSubTextsForSampleSolutionEntry(value.exerciseId, value.id)
              case Some(username) => ctx.tableDefs.futureSubTextsForUserSolutionEntry(value.exerciseId, username, value.id)
            }
          }
        ),
        Field(
          "paragraphCitations",
          ListType(ParagraphCitation.queryType),
          resolve = { case Context(value, ctx, _, _, _, _, _, _, _, _, _, _, _, _) =>
            value.username match {
              case None           => ctx.tableDefs.futureParagraphCitationsForSampleSolutionEntry(value.exerciseId, value.id)
              case Some(username) => ctx.tableDefs.futureParagraphCitationsForUserSolutionEntry(value.exerciseId, username, value.id)
            }
          }
        )
      )
    )
  }

  val inputType: InputObjectType[FlatSolutionEntryInput] = {
    implicit val x0: InputType[Applicability]                = Applicability.graphQLType
    implicit val x1: InputObjectType[AnalyzedSubText]        = AnalyzedSubText.inputType
    implicit val x2: InputObjectType[ParagraphCitationInput] = ParagraphCitation.inputType

    deriveInputObjectType()
  }

  val inputJsonFormat: OFormat[FlatSolutionEntryInput] = {
    implicit val analyzedSubTextFormat: OFormat[AnalyzedSubText]          = Json.format
    implicit val paragraphCitationFormat: OFormat[ParagraphCitationInput] = ParagraphCitation.inputJsonFormat

    Json.format
  }

}

trait FlatSolutionEntryRepo {
  self: TableDefs =>

  import profile.api._

  protected val flatSampleSolutionEntriesTableTQ = TableQuery[FlatSampleSolutionEntriesTable]
  protected val flatUserSolutionEntriesTableTQ   = TableQuery[FlatUserSolutionEntriesTable]

  private type QueryResultType = (Int, String, Applicability, Option[Int], Option[Int], Option[Int])

  private def applyEntries(exerciseId: Int, username: Option[String], entries: Seq[QueryResultType]): Seq[FlatSolutionEntry] = entries.map {
    case (id, text, applicability, weight, priorityPoints, parentId) =>
      FlatSolutionEntry(exerciseId, username, id, text, applicability, weight, priorityPoints, parentId)
  }

  def futureSampleSolutionForExercise(exerciseId: Int): Future[Seq[FlatSolutionEntry]] = for {
    entriesResult <- db.run(
      flatSampleSolutionEntriesTableTQ
        .filter(_.exerciseId === exerciseId)
        .map(entry => (entry.id, entry.text, entry.applicability, entry.weight, entry.priorityPoints, entry.parentId))
        .result
    )
  } yield applyEntries(exerciseId, None, entriesResult)

  def futureUserHasSubmittedSolution(exerciseId: Int, username: String): Future[Boolean] = db.run(
    flatUserSolutionEntriesTableTQ.filter(entry => entry.exerciseId === exerciseId && entry.username === username).length.result.map(_ > 0)
  )

  def futureUsersWithSolution(exerciseId: Int): Future[Seq[String]] = db.run(
    flatUserSolutionEntriesTableTQ.filter(_.exerciseId === exerciseId).map(_.username).distinct.result
  )

  def futureUserSolutionForExercise(exerciseId: Int, username: String): Future[Seq[FlatSolutionEntry]] = for {
    entriesResult <- db.run(
      flatUserSolutionEntriesTableTQ
        .filter(entry => entry.exerciseId === exerciseId && entry.username === username)
        .map(entry => (entry.id, entry.text, entry.applicability, entry.weight, entry.priorityPoints, entry.parentId))
        .result
    )
  } yield applyEntries(exerciseId, Some(username), entriesResult)

  protected abstract class FlatSolutionEntriesTable[T](tag: Tag, name: String) extends Table[T](tag, s"${name}_solution_entries") {

    def exerciseId = column[Int]("exercise_id")

    def id = column[Int]("id")

    def text = column[String]("text")

    def applicability = column[Applicability]("applicability")

    def weight = column[Option[Int]]("weight")

    def priorityPoints = column[Option[Int]]("priority_points")

    def parentId = column[Option[Int]]("parent_id")

    def exercise = foreignKey(s"${name}_exercise_fk", exerciseId, exercisesTQ)(_.id, onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade)

  }

  protected class FlatSampleSolutionEntriesTable(tag: Tag) extends FlatSolutionEntriesTable[FlatSolutionEntry.FlatSampleSolutionEntry](tag, "sample") {

    def pk = primaryKey("sample_solution_entries_pk", (exerciseId, id))

    override def * = (exerciseId, id, text, applicability, weight, priorityPoints, parentId)

  }

  protected class FlatUserSolutionEntriesTable(tag: Tag) extends FlatSolutionEntriesTable[FlatSolutionEntry.FlatUserSolutionEntry](tag, "user") {

    def username = column[String]("username", O.PrimaryKey)

    def pk = primaryKey("user_solution_entries_pk", (exerciseId, username, id))

    def user =
      foreignKey("user_solution_entries_user_fk", username, usersTQ)(_.username, onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade)

    override def * = (exerciseId, username, id, text, applicability, weight, priorityPoints, parentId)

  }

}
