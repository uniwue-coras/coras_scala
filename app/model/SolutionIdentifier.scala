package model

import model.graphql.{GraphQLContext, QueryType}
import sangria.macros.derive.deriveObjectType
import sangria.schema.{EnumType, ObjectType}

import scala.annotation.unused

final case class SolutionIdentifier(
  exerciseId: Int,
  exerciseTitle: String,
  correctionStatus: Option[CorrectionStatus]
)

object SolutionIdentifierGraphQLTypes extends QueryType[SolutionIdentifier] {

  @unused private implicit val correctionStatus: EnumType[CorrectionStatus] = CorrectionStatus.graphQLType

  override val queryType: ObjectType[GraphQLContext, SolutionIdentifier] = deriveObjectType()

}
