package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

final case class SolutionIdentifier(
  exerciseId: Int,
  exerciseTitle: String,
  correctionFinished: Option[Boolean]
)

object SolutionIdentifierGraphQLTypes extends GraphQLBasics {
  val queryType: ObjectType[GraphQLContext, SolutionIdentifier] = ObjectType(
    "SolutionIdentifier",
    fields[GraphQLContext, SolutionIdentifier](
      Field("exerciseId", IntType, resolve = _.value.exerciseId),
      Field("exerciseTitle", StringType, resolve = _.value.exerciseTitle),
      Field("correctionFinished", OptionType(BooleanType), resolve = _.value.correctionFinished)
    )
  )
}
