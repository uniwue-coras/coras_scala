package model

import model.graphql.{GraphQLContext, MyQueryType}
import sangria.schema._

final case class SolutionIdentifier(
  exerciseId: Int,
  exerciseTitle: String,
  correctionStatus: Option[CorrectionStatus]
)

object SolutionIdentifierGraphQLTypes extends MyQueryType[SolutionIdentifier]:
  override val queryType: ObjectType[GraphQLContext, SolutionIdentifier] = ObjectType(
    "SolutionIdentifier",
    fields[GraphQLContext, SolutionIdentifier](
      Field("exerciseId", IntType, resolve = _.value.exerciseId),
      Field("exerciseTitle", StringType, resolve = _.value.exerciseTitle),
      Field("correctionStatus", OptionType(CorrectionStatus.graphQLType), resolve = _.value.correctionStatus)
    )
  )
