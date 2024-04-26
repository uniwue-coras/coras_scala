package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import model.userSolution.{UserSolutionNode, UserSolutionNodeQueries}
import sangria.schema._

final case class ReviewData(
  userSolution: Seq[UserSolutionNode],
  sampleSolution: Seq[SampleSolutionNode],
  matches: Seq[DbSolutionNodeMatch],
  comment: String,
  points: Int
)

object ReviewDataGraphqlTypes extends GraphQLBasics:
  val queryType: ObjectType[GraphQLContext, ReviewData] = ObjectType(
    "ReviewData",
    fields[GraphQLContext, ReviewData](
      Field("userSolution", ListType(UserSolutionNodeQueries.queryType), resolve = _.value.userSolution),
      Field("sampleSolution", ListType(SampleSolutionNode.queryType), resolve = _.value.sampleSolution),
      Field("matches", ListType(SolutionNodeMatch.interfaceType), resolve = _.value.matches),
      Field("comment", StringType, resolve = _.value.comment),
      Field("points", IntType, resolve = _.value.points)
    )
  )
