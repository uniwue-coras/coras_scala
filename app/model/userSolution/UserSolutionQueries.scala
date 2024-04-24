package model.userSolution

import model.graphql.{GraphQLBasics, GraphQLContext, UserFacingGraphQLError}
import model.{CorrectionResult, CorrectionStatus, CorrectionSummaryGraphQLTypes, DbCorrectionSummary, DbSolutionNodeMatch}
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

object UserSolutionQueries extends GraphQLBasics:
  private val resolveNodes: Resolver[UserSolution, Seq[UserSolutionNode]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _), UserSolution(username, exerciseId, _, _)) => tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
  }

  private val resolveNode: Resolver[UserSolution, Option[UserSolutionNode]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _), UserSolution(username, exerciseId, _, _), args) =>
      tableDefs.futureUserSolutionNodeForExercise(username, exerciseId, args.arg(userSolutionNodeIdArgument))
  }

  private val resolveMatches: Resolver[UserSolution, Seq[DbSolutionNodeMatch]] = unpackedResolver {
    case (_, UserSolution(_, _, CorrectionStatus.Waiting, _)) => Future.failed(UserFacingGraphQLError("Initial correction not yet performed!"))
    case (GraphQLContext(_, tableDefs, _, _), UserSolution(username, exerciseId, _, _)) => tableDefs.futureMatchesForUserSolution(username, exerciseId)
  }

  private val resolveCorrectionSummary: Resolver[UserSolution, Option[DbCorrectionSummary]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _), UserSolution(username, exerciseId, _, _)) => tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
  }

  private val resolvePerformCurrentCorrection: Resolver[UserSolution, CorrectionResult] = unpackedResolver {
    case (GraphQLContext(ws, tableDefs, _, given ExecutionContext), UserSolution(username, exerciseId, _, _)) =>
      UserSolution.correct(ws, tableDefs, exerciseId, username)
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
