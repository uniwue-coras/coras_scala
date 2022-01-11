package model

import enumeratum.{EnumEntry, PlayEnum}
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

  implicit val x: EnumType[ParagraphType] = ParagraphType.graphQLType

  val queryType: ObjectType[GraphQLContext, ParagraphCitation] = deriveObjectType()

  val inputType: InputObjectType[ParagraphCitationInput] = deriveInputObjectType()

  val inputJsonFormat: OFormat[ParagraphCitationInput] = Json.format

}
