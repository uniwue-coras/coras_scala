package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{ObjectType, fields, IntType, OptionType, FloatType, Field}

final case class SolutionNodeMatchKey(
  username: String,
  exerciseId: Int
)

final case class SolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  certainty: Option[Double] = None
)

type DbSolutionNodeMatch = (SolutionNodeMatchKey, SolutionNodeMatch)

object SolutionNodeMatchGraphQLTypes extends GraphQLBasics:
  val queryType: ObjectType[GraphQLContext, SolutionNodeMatch] = ObjectType(
    "SolutionNodeMatch",
    fields[GraphQLContext, SolutionNodeMatch](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("matchStatus", MatchStatus.graphQLType, resolve = _.value.matchStatus),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty)
    )
  )
