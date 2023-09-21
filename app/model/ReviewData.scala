package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.macros.derive.deriveObjectType
import sangria.schema.ObjectType

import scala.annotation.unused

final case class ReviewData(
  userSolution: Seq[FlatUserSolutionNode],
  sampleSolution: Seq[FlatSampleSolutionNode],
  matches: Seq[DbSolutionNodeMatch],
  comment: String,
  points: Int
)

object ReviewDataGraphqlTypes extends GraphQLBasics {

  val queryType: ObjectType[GraphQLContext, ReviewData] = {
    @unused implicit val x0: ObjectType[GraphQLContext, FlatUserSolutionNode]   = FlatUserSolutionNodeGraphQLTypes.queryType
    @unused implicit val x1: ObjectType[GraphQLContext, FlatSampleSolutionNode] = FlatSampleSolutionNodeGraphQLTypes.queryType
    @unused implicit val x2: ObjectType[GraphQLContext, DbSolutionNodeMatch]    = SolutionNodeMatchGraphQLTypes.queryType

    deriveObjectType()
  }

}
