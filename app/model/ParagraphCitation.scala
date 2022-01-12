package model

import enumeratum.{EnumEntry, PlayEnum}
import model.ParagraphCitation.SampleSolutionParagraphCitation
import model.graphql.GraphQLContext
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{deriveEnumType, deriveInputObjectType, deriveObjectType}
import sangria.schema.{EnumType, InputObjectType, ObjectType}

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

  implicit val x: EnumType[ParagraphType] = ParagraphType.graphQLType

  val queryType: ObjectType[GraphQLContext, ParagraphCitation] = deriveObjectType()

  val inputType: InputObjectType[ParagraphCitationInput] = deriveInputObjectType()

  val inputJsonFormat: OFormat[ParagraphCitationInput] = Json.format

}

trait ParagraphCitationRepo {
  self: TableDefs =>

  import profile.api._

  protected val sampleSolutionParagraphCitationsTableTQ = TableQuery[SampleSolutionParagraphCitationsTable]

  private implicit val paragraphTypeColumnType: BaseColumnType[ParagraphType] =
    MappedColumnType.base[ParagraphType, String](_.entryName, ParagraphType.withName)

  protected class SampleSolutionParagraphCitationsTable(tag: Tag)
      extends Table[SampleSolutionParagraphCitation](tag, "sample_solution_entry_paragraph_citations") {

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

    override def * = (exerciseId, entryId, id, startIndex, endIndex, paragraphType, paragraph, subParagraph, sentence, lawCode)

  }
}
