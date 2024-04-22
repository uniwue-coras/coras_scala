package model

import model.graphql.GraphQLContext
import sangria.schema._

trait SolutionNodeMatch:
  def sampleNodeId: Int
  def userNodeId: Int
  def matchStatus: MatchStatus
  def certainty: Option[Double]
  def correctness: Correctness

object SolutionNodeMatch:
  def interfaceType: InterfaceType[GraphQLContext, SolutionNodeMatch] = InterfaceType(
    "ISolutionNodeMatch",
    fields[GraphQLContext, SolutionNodeMatch](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("matchStatus", MatchStatus.graphQLType, resolve = _.value.matchStatus),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty),
      Field("correctness", Correctness.graphQLType, resolve = _.value.correctness)
    )
  )
