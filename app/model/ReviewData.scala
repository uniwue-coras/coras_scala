package model

import model.graphql.{GraphQLContext, MyQueryType}
import sangria.schema._

final case class ReviewData(
  userSolution: Seq[FlatUserSolutionNode],
  sampleSolution: Seq[FlatSampleSolutionNode],
  matches: Seq[DbSolutionNodeMatch],
  comment: String,
  points: Int
)

object ReviewDataGraphqlTypes extends MyQueryType[ReviewData]:
  override val queryType: ObjectType[GraphQLContext, ReviewData] = ObjectType(
    "ReviewData",
    fields[GraphQLContext, ReviewData](
      Field("userSolution", ListType(FlatUserSolutionNodeGraphQLTypes.queryType), resolve = _.value.userSolution),
      Field("sampleSolution", ListType(FlatSampleSolutionNodeGraphQLTypes.queryType), resolve = _.value.sampleSolution),
      Field("matches", ListType(DbSolutionNodeMatch.queryType), resolve = _.value.matches),
      Field("comment", StringType, resolve = _.value.comment),
      Field("points", IntType, resolve = _.value.points)
    )
  )
