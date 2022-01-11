package model

import model.graphql.GraphQLContext
import sangria.macros.derive.{InputObjectTypeName, deriveInputObjectType, deriveObjectType}
import sangria.schema.{EnumType, InputObjectType, ObjectType}

case class AnalyzedSubText(
  text: String,
  applicability: Applicability
)

object AnalyzedSubText {

  private implicit val x: EnumType[Applicability] = Applicability.graphQLType

  val queryType: ObjectType[GraphQLContext, AnalyzedSubText] = deriveObjectType()

  val inputType: InputObjectType[AnalyzedSubText] = deriveInputObjectType(
    InputObjectTypeName("AnalyzedSubTextInput")
  )

}
