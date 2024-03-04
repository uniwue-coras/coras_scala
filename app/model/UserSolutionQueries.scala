package model

import model.graphql.{GraphQLBasics, GraphQLContext, UserFacingGraphQLError}
import sangria.schema._

import scala.concurrent.Future

object UserSolutionQueries extends GraphQLBasics:
  private val resolveNodes: Resolver[UserSolution, Seq[UserSolutionNode]] = unpackedResolver {
    case (GraphQLContext(tableDefs, _, _), UserSolution(username, exerciseId, _, _)) => tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
  }

  private val resolveNode: Resolver[UserSolution, Option[UserSolutionNode]] = unpackedResolverWithArgs {
    case (GraphQLContext(tableDefs, _, _), UserSolution(username, exerciseId, _, _), args) =>
      tableDefs.futureUserSolutionNodeForExercise(username, exerciseId, args.arg(userSolutionNodeIdArgument))
  }

  private val resolveMatches: Resolver[UserSolution, Seq[DbSolutionNodeMatch]] = unpackedResolver {
    case (_, UserSolution(_, _, CorrectionStatus.Waiting, _)) => Future.failed(UserFacingGraphQLError("Initial correction not yet performed!"))
    case (GraphQLContext(tableDefs, _, _), UserSolution(username, exerciseId, _, _)) => tableDefs.futureMatchesForUserSolution(username, exerciseId)
  }

  private val resolveCorrectionSummary: Resolver[UserSolution, Option[DbCorrectionSummary]] = unpackedResolver {
    case (GraphQLContext(tableDefs, _, _), UserSolution(username, exerciseId, _, _)) => tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
  }

  private val resolvePerformCurrentCorrection: Resolver[UserSolution, CorrectionResult] = unpackedResolver {
    case (GraphQLContext(tableDefs, _, _ec), UserSolution(username, exerciseId, _, _)) => UserSolution.correct(tableDefs, exerciseId, username)(_ec)
  }

  val queryType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolution",
    fields[GraphQLContext, UserSolution](
      Field("username", StringType, resolve = _.value.username),
      Field("correctionStatus", CorrectionStatus.graphQLType, resolve = _.value.correctionStatus),
      Field("nodes", ListType(UserSolutionNodeQueries.queryType), resolve = resolveNodes),
      Field("node", OptionType(UserSolutionNodeQueries.queryType), arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveNode),
      Field("matches", ListType(DbSolutionNodeMatch.queryType), resolve = resolveMatches),
      Field("correctionSummary", OptionType(CorrectionSummaryGraphQLTypes.queryType), resolve = resolveCorrectionSummary),
      Field("performCurrentCorrection", CorrectionResult.queryType, resolve = resolvePerformCurrentCorrection)
    )
  )
