package model

import model.graphql.GraphQLContext
import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType, deriveObjectType}
import sangria.schema.{EnumType, InputObjectType, ObjectType}

case class AnalyzedSubText(
  text: String,
  applicability: Applicability
)

object AnalyzedSubText {

  type AnalyzedSampleSubText = (Int, Int, Int, String, Applicability)

  private implicit val x: EnumType[Applicability] = Applicability.graphQLType

  val queryType: ObjectType[GraphQLContext, AnalyzedSubText] = deriveObjectType()

  val inputType: InputObjectType[AnalyzedSubText] = deriveInputObjectType(
    InputObjectTypeName("AnalyzedSubTextInput")
  )

}

trait AnalyzedSubTextRepo {
  self: TableDefs =>

  import profile.api._

  protected val sampleSubTextsTQ = TableQuery[AnalyzedSampleSubTextsTable]

  protected class AnalyzedSampleSubTextsTable(tag: Tag) extends Table[AnalyzedSubText.AnalyzedSampleSubText](tag, "sample_solution_entry_sub_texts") {

    def exerciseId = column[Int]("exercise_id", O.PrimaryKey)

    def entryId = column[Int]("entry_id", O.PrimaryKey)

    def id = column[Int]("id", O.PrimaryKey)

    def text = column[String]("text")

    def applicability = column[Applicability]("applicability")

    override def * = (exerciseId, entryId, id, text, applicability)

  }
}
