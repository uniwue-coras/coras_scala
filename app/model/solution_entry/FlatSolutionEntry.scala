package model.solution_entry

import model.graphql.GraphQLContext
import model.{AnalyzedSubText, Applicability, ParagraphCitation, ParagraphCitationInput}
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive._
import sangria.schema._

final case class FlatSolutionEntry(
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

  val queryType: ObjectType[GraphQLContext, FlatSolutionEntry] = {
    implicit val x: EnumType[Applicability] = Applicability.graphQLType

    deriveObjectType(
      AddFields(
        Field("subTexts", ListType(AnalyzedSubText.queryType), resolve = _ => Seq()),
        Field("paragraphCitations", ListType(ParagraphCitation.queryType), resolve = _ => Seq(???))
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
