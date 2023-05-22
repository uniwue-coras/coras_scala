package model.graphql

import model.{FlatSampleSolutionNode, FlatUserSolutionNode, SolutionNodeMatch}
import sangria.schema.{Field, ListType, ObjectType, fields}

final case class ReviewData(
  userSolution: Seq[FlatUserSolutionNode],
  sampleSolution: Seq[FlatSampleSolutionNode],
  matches: Seq[SolutionNodeMatch]
)

object ReviewDataGraphqlTypes extends GraphQLBasics {

  // FIXME: deriveObjectType?
  val queryType: ObjectType[GraphQLContext, ReviewData] = ObjectType(
    "ReviewData",
    fields[GraphQLContext, ReviewData](
      Field("userSolution", ListType(FlatSolutionNodeGraphQLTypes.flatUserSolutionQueryType), resolve = _.value.userSolution),
      Field("sampleSolution", ListType(FlatSolutionNodeGraphQLTypes.flatSampleSolutionGraphQLType), resolve = _.value.sampleSolution),
      Field("matches", ListType(SolutionNodeMatchGraphQLTypes.queryType), resolve = _.value.matches)
    )
  )

}
