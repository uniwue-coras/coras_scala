package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

final case class ReviewData(
  userSolution: Seq[FlatUserSolutionNode],
  sampleSolution: Seq[FlatSampleSolutionNode],
  matches: Seq[DbSolutionNodeMatch],
  comment: String,
  points: Int
)

object ReviewDataGraphqlTypes extends GraphQLBasics:
  val queryType: ObjectType[GraphQLContext, ReviewData] = ObjectType(
    "ReviewData",
    fields[GraphQLContext, ReviewData](
      Field("userSolution", ListType(FlatUserSolutionNode.queryType), resolve = _.value.userSolution),
      Field("sampleSolution", ListType(FlatSampleSolutionNode.queryType), resolve = _.value.sampleSolution),
      Field("matches", ListType(SolutionNodeMatchGraphQLTypes.queryType), resolve = _.value.matches),
      Field("comment", StringType, resolve = _.value.comment),
      Field("points", IntType, resolve = _.value.points)
    )
  )
