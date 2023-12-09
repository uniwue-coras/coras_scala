package model

import sangria.schema.{InterfaceType, fields, Field, IntType, OptionType, FloatType}
import model.graphql.GraphQLContext

trait SolutionNodeMatch:
  def sampleNodeId: Int
  def userNodeId: Int
  def matchStatus: MatchStatus
  def certainty: Option[Double]

object SolutionNodeMatch:
  def interfaceType: InterfaceType[GraphQLContext, SolutionNodeMatch] = InterfaceType(
    "ISolutionNodeMatch",
    fields[GraphQLContext, SolutionNodeMatch](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("matchStatus", MatchStatus.graphQLType, resolve = _.value.matchStatus),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty)
    )
  )
