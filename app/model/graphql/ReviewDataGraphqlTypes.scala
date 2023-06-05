package model.graphql

import model.{FlatSampleSolutionNode, FlatUserSolutionNode, SolutionNodeMatch}
import sangria.macros.derive.deriveObjectType
import sangria.schema.ObjectType

import scala.annotation.unused

final case class ReviewData(
  userSolution: Seq[FlatUserSolutionNode],
  sampleSolution: Seq[FlatSampleSolutionNode],
  matches: Seq[SolutionNodeMatch],
  comment: String,
  points: Int
)

object ReviewDataGraphqlTypes extends GraphQLBasics {

  // FIXME: deriveObjectType?
  val queryType: ObjectType[GraphQLContext, ReviewData] = {
    @unused implicit val x0: ObjectType[GraphQLContext, FlatUserSolutionNode]   = FlatSolutionNodeGraphQLTypes.flatUserSolutionQueryType
    @unused implicit val x1: ObjectType[GraphQLContext, FlatSampleSolutionNode] = FlatSolutionNodeGraphQLTypes.flatSampleSolutionGraphQLType
    @unused implicit val x2: ObjectType[Unit, SolutionNodeMatch]                = SolutionNodeMatchGraphQLTypes.queryType

    deriveObjectType(
    )
  }

}
