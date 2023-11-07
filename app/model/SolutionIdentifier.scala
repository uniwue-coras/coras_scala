package model

import model.enums.CorrectionStatus
import model.graphql.{GraphQLContext, QueryType, UserSolutionGraphQLTypes}
import sangria.macros.derive.deriveObjectType
import sangria.schema.{EnumType, ObjectType}

import scala.annotation.unused

final case class SolutionIdentifier(
  exerciseId: Int,
  exerciseTitle: String,
  correctionStatus: Option[CorrectionStatus]
)

object SolutionIdentifierGraphQLTypes extends QueryType[SolutionIdentifier] {

  @unused private implicit val correctionStatus: EnumType[CorrectionStatus] = UserSolutionGraphQLTypes.correctionStatusGraphQLType

  override val queryType: ObjectType[GraphQLContext, SolutionIdentifier] = deriveObjectType()

}
