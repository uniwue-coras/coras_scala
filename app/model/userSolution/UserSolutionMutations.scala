package model.userSolution

import model._
import model.graphql.{GraphQLBasics, GraphQLContext, UserFacingGraphQLError}
import sangria.schema.{BooleanType, Field, ObjectType, OptionType, fields}

import scala.concurrent.Future

object UserSolutionMutations extends GraphQLBasics {

  private val resolveUserSolutionNode: Resolver[UserSolution, Option[UserSolutionNode]] = unpackedResolverWithArgs {
    case (_, tableDefs, _, UserSolution(username, exerciseId, _, _), args) =>
      tableDefs.futureUserSolutionNodeForExercise(username, exerciseId, args.arg(userSolutionNodeIdArgument))
  }

  private val resolveUpdateCorrectionResult: Resolver[UserSolution, CorrectionSummary] = unpackedResolverWithArgs {
    case (_, tableDefs, _ec, UserSolution(username, exerciseId, correctionFinished, _), args) =>
      if (correctionFinished) { Future.failed(UserFacingGraphQLError("Correction was already finished!")) }
      else {
        implicit val ec = _ec
        val comment     = args.arg(commentArgument)
        val points      = args.arg(pointsArgument)

        for {
          _ <- tableDefs.futureUpsertCorrectionResult(username, exerciseId, comment, points)
        } yield CorrectionSummary(exerciseId, username, comment, points)
      }
  }

  private val resolveFinishCorrection: Resolver[UserSolution, Boolean] = unpackedResolver {
    case (_, _, _, userSolution) if userSolution.correctionFinished => Future.failed(UserFacingGraphQLError("Correction is already finished!"))
    case (_, tableDefs, _ec, userSolution) =>
      implicit val ec = _ec

      for {
        _ <- tableDefs.futureUpdateCorrectionFinished(userSolution.dbKey, true)
      } yield true
  }

  val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutations",
    fields[GraphQLContext, UserSolution](
      Field("node", OptionType(UserSolutionNodeMutations.mutationType), arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveUserSolutionNode),
      Field(
        "updateCorrectionResult",
        CorrectionSummaryGraphQLTypes.queryType,
        arguments = commentArgument :: pointsArgument :: Nil,
        resolve = resolveUpdateCorrectionResult
      ),
      Field("finishCorrection", BooleanType, resolve = resolveFinishCorrection)
    )
  )
}
