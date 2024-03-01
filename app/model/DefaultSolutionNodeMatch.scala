package model

import model.graphql.GraphQLContext
import model.matching.nodeMatching.SolutionNodeMatchExplanation
import sangria.schema._
import model.matching.nodeMatching.AnnotatedSolutionNode
import model.matching.Match

final case class DefaultSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  maybeExplanation: Option[SolutionNodeMatchExplanation]
) extends SolutionNodeMatch:

  override val matchStatus               = MatchStatus.Automatic
  override def certainty: Option[Double] = maybeExplanation.map(_.certainty)

object DefaultSolutionNodeMatch:
  val queryType: ObjectType[GraphQLContext, DefaultSolutionNodeMatch] = ObjectType(
    "DefaultSolutionNodeMatch",
    interfaces(SolutionNodeMatch.interfaceType),
    fields[GraphQLContext, DefaultSolutionNodeMatch](
      Field("maybeExplanation", OptionType(SolutionNodeMatchExplanation.queryType), resolve = _.value.maybeExplanation)
    )
  )

  def fromSolutionNodeMatch(m: Match[AnnotatedSolutionNode, SolutionNodeMatchExplanation]) = m match
    case Match(sampleValue, userValue, explanation) => DefaultSolutionNodeMatch(sampleValue.id, userValue.id, explanation)
