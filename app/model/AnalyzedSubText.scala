package model

import model.graphql.GraphQLContext
import sangria.macros.derive.deriveObjectType
import sangria.schema.{EnumType, ObjectType}

case class AnalyzedSubText(
  text: String,
  applicability: Applicability
)

object AnalyzedSubText {

  val queryType: ObjectType[GraphQLContext, AnalyzedSubText] = {
    implicit val x: EnumType[Applicability] = Applicability.graphQLType

    deriveObjectType()
  }

}
