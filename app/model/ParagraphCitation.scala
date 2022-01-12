package model

import enumeratum.{EnumEntry, PlayEnum}
import model.ParagraphCitation.{SampleSolutionParagraphCitation, UserSolutionParagraphCitation}
import model.graphql.GraphQLContext
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{deriveEnumType, deriveInputObjectType, deriveObjectType}
import sangria.schema.{EnumType, InputObjectType, ObjectType}

import scala.concurrent.Future

sealed trait ParagraphType extends EnumEntry

object ParagraphType extends PlayEnum[ParagraphType] {

  override val values: IndexedSeq[ParagraphType] = findValues

  // values

  case object German extends ParagraphType

  case object Bavarian extends ParagraphType

  // GraphQL type

  val graphQLType: EnumType[ParagraphType] = deriveEnumType()

}

final case class ParagraphCitation(
  id: Int,
  startIndex: Int,
  endIndex: Int,
  paragraphType: ParagraphType,
  paragraph: Int,
  subParagraph: Option[Int],
  sentence: Option[Int],
  lawCode: Option[String]
)

final case class ParagraphCitationInput(
  startIndex: Int,
  endIndex: Int,
  paragraphType: ParagraphType,
  paragraph: Int,
  subParagraph: Option[Int],
  sentence: Option[Int],
  lawCode: Option[String]
)

object ParagraphCitation {

  type SampleSolutionParagraphCitation = (Int, Int, Int, Int, Int, ParagraphType, Int, Option[Int], Option[Int], Option[String])
  type UserSolutionParagraphCitation   = (Int, String, Int, Int, Int, Int, ParagraphType, Int, Option[Int], Option[Int], Option[String])

  implicit val x: EnumType[ParagraphType] = ParagraphType.graphQLType

  val queryType: ObjectType[GraphQLContext, ParagraphCitation] = deriveObjectType()

  val inputType: InputObjectType[ParagraphCitationInput] = deriveInputObjectType()

  val inputJsonFormat: OFormat[ParagraphCitationInput] = Json.format

}

trait ParagraphCitationRepo {
  self: TableDefs =>

  import profile.api._

  protected val sampleSolutionParagraphCitationsTQ = TableQuery[SampleSolutionParagraphCitationsTable]
  protected val userSolutionParagraphCitationsTQ   = TableQuery[UserSolutionParagraphCitationsTable]

  private type QueryResult = (Int, Int, Int, ParagraphType, Int, Option[Int], Option[Int], Option[String])

  private def applyQueryResults(results: Seq[QueryResult]): Seq[ParagraphCitation] = results.map {
    case (id, startIndex, endIndex, paragraphType, paragraph, subParagraph, sentence, lawCode) =>
      ParagraphCitation(id, startIndex, endIndex, paragraphType, paragraph, subParagraph, sentence, lawCode)
  }

  private def citationsTableQueryColumns[T](cit: ParagraphCitationsTable[T]) =
    (cit.id, cit.startIndex, cit.endIndex, cit.paragraphType, cit.paragraph, cit.subParagraph, cit.sentence, cit.lawCode)

  def futureParagraphCitationsForSampleSolutionEntry(exerciseId: Int, entryId: Int): Future[Seq[ParagraphCitation]] = for {
    queryResult <- db.run(
      sampleSolutionParagraphCitationsTQ
        .filter(cit => cit.exerciseId === exerciseId && cit.entryId === entryId)
        .map { citationsTableQueryColumns }
        .result
    )
  } yield applyQueryResults(queryResult)

  def futureParagraphCitationsForUserSolutionEntry(exerciseId: Int, username: String, entryId: Int): Future[Seq[ParagraphCitation]] = for {
    queryResult <- db.run(
      userSolutionParagraphCitationsTQ
        .filter(cit => cit.exerciseId === exerciseId && cit.username === username && cit.entryId === entryId)
        .map(citationsTableQueryColumns)
        .result
    )
  } yield applyQueryResults(queryResult)

  private implicit val paragraphTypeColumnType: BaseColumnType[ParagraphType] =
    MappedColumnType.base[ParagraphType, String](_.entryName, ParagraphType.withName)

  protected abstract class ParagraphCitationsTable[T](tag: Tag, name: String) extends Table[T](tag, name) {

    def exerciseId = column[Int]("exercise_id", O.PrimaryKey)

    def entryId = column[Int]("entry_id", O.PrimaryKey)

    def id = column[Int]("id", O.PrimaryKey)

    def startIndex = column[Int]("start_index")

    def endIndex = column[Int]("end_index")

    def paragraphType = column[ParagraphType]("paragraph_type")

    def paragraph = column[Int]("paragraph")

    def subParagraph = column[Option[Int]]("sub_paragraph")

    def sentence = column[Option[Int]]("sentence")

    def lawCode = column[Option[String]]("law_code")

  }

  protected class SampleSolutionParagraphCitationsTable(tag: Tag)
      extends ParagraphCitationsTable[SampleSolutionParagraphCitation](tag, "sample_solution_entry_paragraph_citations") {

    override def * = (exerciseId, entryId, id, startIndex, endIndex, paragraphType, paragraph, subParagraph, sentence, lawCode)

  }

  protected class UserSolutionParagraphCitationsTable(tag: Tag)
      extends ParagraphCitationsTable[UserSolutionParagraphCitation](tag, "user_solution_entry_paragraph_citations") {

    def username = column[String]("username", O.PrimaryKey)

    override def * = (exerciseId, username, entryId, id, startIndex, endIndex, paragraphType, paragraph, subParagraph, sentence, lawCode)

  }

}
