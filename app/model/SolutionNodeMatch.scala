package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import model.matching.nodeMatching.SolutionNodeMatchExplanation
import sangria.schema._

trait SolutionNodeMatchTrait:
  def sampleNodeId: Int
  def userNodeId: Int
  def certainty: Option[Double]

object SolutionNodeMatchTrait:
  val interfaceType: InterfaceType[GraphQLContext, SolutionNodeMatchTrait] = InterfaceType(
    "ISolutionNodeMatch",
    fields[GraphQLContext, SolutionNodeMatchTrait](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty)
    )
  )

final case class SolutionNodeMatchKey(
  username: String,
  exerciseId: Int
)

final case class SolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  certainty: Option[Double] = None
) extends SolutionNodeMatchTrait

type DbSolutionNodeMatch = (SolutionNodeMatchKey, SolutionNodeMatch)

object SolutionNodeMatchGraphQLTypes extends GraphQLBasics:
  val queryType: ObjectType[GraphQLContext, SolutionNodeMatch] = ObjectType(
    "SolutionNodeMatch",
    interfaces[GraphQLContext, SolutionNodeMatch](SolutionNodeMatchTrait.interfaceType),
    fields[GraphQLContext, SolutionNodeMatch](
      // Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      // Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("matchStatus", MatchStatus.graphQLType, resolve = _.value.matchStatus),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty)
    )
  )

final case class DefaultSolutionNodeMatch(
  sampleNode: SolutionNode,
  // sampleNodeId: Int,
  userNode: SolutionNode,
  // userNodeId: Int,
  maybeExplanation: Option[SolutionNodeMatchExplanation]
) extends SolutionNodeMatchTrait:
  override def sampleNodeId              = sampleNode.id
  override def userNodeId                = userNode.id
  override def certainty: Option[Double] = maybeExplanation.map(_.certainty)

object DefaultSolutionNodeMatch:
  val queryType: ObjectType[GraphQLContext, DefaultSolutionNodeMatch] = ObjectType(
    "DefaultSolutionNodeMatch",
    interfaces[GraphQLContext, DefaultSolutionNodeMatch](SolutionNodeMatchTrait.interfaceType),
    fields[GraphQLContext, DefaultSolutionNodeMatch](
      // Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      // Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty),
      Field("maybeExplanation", OptionType(SolutionNodeMatchExplanation.queryType), resolve = _.value.maybeExplanation)
    )
  )
