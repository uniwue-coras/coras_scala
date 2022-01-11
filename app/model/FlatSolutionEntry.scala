package model

import model.graphql.GraphQLContext
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

object FlatSolutionEntry {

  private implicit val x: EnumType[Applicability] = Applicability.graphQLType

  val queryType: ObjectType[GraphQLContext, FlatSolutionEntry] = deriveObjectType(
    AddFields(
      Field("subTexts", ListType(AnalyzedSubText.queryType), resolve = _ => Seq()),
      Field("paragraphCitations", ListType(ParagraphCitation.queryType), resolve = _ => Seq(???))
    )
  )

  val inputType: InputObjectType[FlatSolutionEntry] = deriveInputObjectType(
    InputObjectTypeName("FlatSolutionEntryInput")
  )

}
