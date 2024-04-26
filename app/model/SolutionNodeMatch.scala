package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

trait SolutionNodeMatch:
  def sampleNodeId: Int
  def userNodeId: Int
  def matchStatus: MatchStatus
  def certainty: Option[Double]
  def paragraphCitationCorrectness: Correctness
  def explanationCorrectness: Correctness

object SolutionNodeMatch extends GraphQLBasics:
  val queryType: ObjectType[GraphQLContext, SolutionNodeMatch] = ObjectType(
    "SolutionNodeMatch",
    fields[GraphQLContext, SolutionNodeMatch](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("matchStatus", MatchStatus.graphQLType, resolve = _.value.matchStatus),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty),
      Field("paragraphCitationCorrectness", Correctness.graphQLType, resolve = _.value.paragraphCitationCorrectness),
      Field("explanationCorrectness", Correctness.graphQLType, resolve = _.value.explanationCorrectness)
    )
  )
