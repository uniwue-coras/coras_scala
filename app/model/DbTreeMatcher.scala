package model

import model.graphql.GraphQLContext
import model.matching.nodeMatching.SolutionNodeMatchExplanation
import sangria.schema._

final case class DefaultSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  maybeExplanation: Option[SolutionNodeMatchExplanation]
) {
  def certainty: Option[Double] = maybeExplanation.map(_.certainty)
}

object DefaultSolutionNodeMatch:
  val queryType: ObjectType[GraphQLContext, DefaultSolutionNodeMatch] = ObjectType(
    "DefaultSolutionNodeMatch",
    fields[GraphQLContext, DefaultSolutionNodeMatch](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty),
      Field("maybeExplanation", OptionType(SolutionNodeMatchExplanation.queryType), resolve = _.value.maybeExplanation)
    )
  )
