package model.userSolution

import model.graphql.{GraphQLBasics, GraphQLContext, UserFacingGraphQLError}
import model.{CorrectionSummary, CorrectionSummaryGraphQLTypes, SolutionNodeMatch}
import sangria.schema._

import scala.concurrent.Future

object UserSolutionQueries extends GraphQLBasics {
  private val resolveNodes: Resolver[UserSolution, Seq[UserSolutionNode]] = unpackedResolver {
    case (_, tableDefs, _, UserSolution(username, exerciseId, _, _)) => tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
  }

  private val resolveNode: Resolver[UserSolution, Option[UserSolutionNode]] = unpackedResolverWithArgs {
    case (_, tableDefs, _, UserSolution(username, exerciseId, _, _), args) =>
      tableDefs.futureUserSolutionNodeForExercise(UserSolutionNodeKey(username, exerciseId, args.arg(userSolNodeIdArg)))
  }

  private val resolveMatches: Resolver[UserSolution, Seq[SolutionNodeMatch]] = unpackedResolver { case (_, tableDefs, _, userSol) =>
    tableDefs.futureMatchesForUserSolution(userSol.dbKey)
  }

  private val resolveCorrectionSummary: Resolver[UserSolution, Option[CorrectionSummary]] = unpackedResolver {
    case (_, tableDefs, _, UserSolution(username, exerciseId, _, _)) => tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
  }

  val queryType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolution",
    fields[GraphQLContext, UserSolution](
      Field("username", StringType, resolve = _.value.username),
      Field("correctionFinished", BooleanType, resolve = _.value.correctionFinished),
      Field("nodes", ListType(UserSolutionNodeQueries.queryType), resolve = resolveNodes),
      Field("node", OptionType(UserSolutionNodeQueries.queryType), arguments = userSolNodeIdArg :: Nil, resolve = resolveNode),
      Field("matches", ListType(SolutionNodeMatch.queryType), resolve = resolveMatches),
      Field("correctionSummary", OptionType(CorrectionSummaryGraphQLTypes.queryType), resolve = resolveCorrectionSummary)
    )
  )

  private val resolveUpdateCorrectionResult: Resolver[UserSolution, CorrectionSummary] = unpackedResolverWithArgs {
    case (_, tableDefs, _ec, UserSolution(username, exerciseId, correctionFinished, _), args) =>
      if (correctionFinished) {
        Future.failed(UserFacingGraphQLError("Correction was already finished!"))
      } else {
        implicit val ec = _ec
        val comment     = args.arg(commentArgument)
        val points      = args.arg(pointsArg)

        for {
          _ <- tableDefs.futureUpsertCorrectionResult(username, exerciseId, comment, points)
        } yield CorrectionSummary(exerciseId, username, comment, points)
      }
  }

  private val resolveDelete: Resolver[UserSolution, String] = unpackedResolverWithAdmin { case (_, tableDefs, _ec, userSolution, _, _) =>
    implicit val ec = _ec

    for {
      _ <- tableDefs.futureDeleteUserSolution(userSolution.dbKey)
    } yield userSolution.username
  }

  private val resolveFinishCorrection: Resolver[UserSolution, Boolean] = unpackedResolverWithCorrector { case (_, tableDefs, _ec, userSolution, _, _) =>
    if (userSolution.correctionFinished) {
      Future.failed(UserFacingGraphQLError("Correction was already finished!"))
    } else {
      implicit val ec = _ec

      for {
        _ <- tableDefs.futureUpdateCorrectionFinished(userSolution.dbKey, true)
      } yield true
    }
  }

  val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutations",
    fields[GraphQLContext, UserSolution](
      Field("node", OptionType(UserSolutionNodeMutations.mutationType), arguments = userSolNodeIdArg :: Nil, resolve = resolveNode),
      Field(
        "updateCorrectionResult",
        CorrectionSummaryGraphQLTypes.queryType,
        arguments = commentArgument :: pointsArg :: Nil,
        resolve = resolveUpdateCorrectionResult
      ),
      Field("delete", StringType, resolve = resolveDelete),
      Field("finishCorrection", BooleanType, resolve = resolveFinishCorrection)
    )
  )

}
