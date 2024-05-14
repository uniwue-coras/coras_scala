package model.userSolution

import model.graphql.{GraphQLBasics, GraphQLContext}
import model.{CorrectionSummaryGraphQLTypes, DbCorrectionSummary, SolutionNodeMatch}
import sangria.schema._

object UserSolutionQueries extends GraphQLBasics {
  private val resolveNodes: Resolver[UserSolution, Seq[UserSolutionNode]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _), UserSolution(username, exerciseId, _, _)) => tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
  }

  private val resolveNode: Resolver[UserSolution, Option[UserSolutionNode]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _), UserSolution(username, exerciseId, _, _), args) =>
      tableDefs.futureUserSolutionNodeForExercise(username, exerciseId, args.arg(userSolutionNodeIdArgument))
  }

  private val resolveMatches: Resolver[UserSolution, Seq[SolutionNodeMatch]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _), UserSolution(username, exerciseId, _, _)) => tableDefs.futureMatchesForUserSolution(username, exerciseId)
  }

  private val resolveCorrectionSummary: Resolver[UserSolution, Option[DbCorrectionSummary]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _), UserSolution(username, exerciseId, _, _)) => tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
  }

  val queryType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolution",
    fields[GraphQLContext, UserSolution](
      Field("username", StringType, resolve = _.value.username),
      Field("correctionFinished", BooleanType, resolve = _.value.correctionFinished),
      Field("nodes", ListType(UserSolutionNodeQueries.queryType), resolve = resolveNodes),
      Field("node", OptionType(UserSolutionNodeQueries.queryType), arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveNode),
      Field("matches", ListType(SolutionNodeMatch.queryType), resolve = resolveMatches),
      Field("correctionSummary", OptionType(CorrectionSummaryGraphQLTypes.queryType), resolve = resolveCorrectionSummary)
    )
  )
}
