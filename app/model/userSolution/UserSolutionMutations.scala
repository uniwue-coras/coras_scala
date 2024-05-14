package model.userSolution

import model._
import model.graphql.{GraphQLBasics, GraphQLContext, UserFacingGraphQLError}
import sangria.schema.{Field, ObjectType, OptionType, fields, BooleanType}

import scala.concurrent.Future

object UserSolutionMutations extends GraphQLBasics {

  private val resolveUserSolutionNode: Resolver[UserSolution, Option[UserSolutionNode]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _), UserSolution(username, exerciseId, _, _), args) =>
      tableDefs.futureUserSolutionNodeForExercise(username, exerciseId, args.arg(userSolutionNodeIdArgument))
  }

  private val resolveUpdateCorrectionResult: Resolver[UserSolution, DbCorrectionSummary] = unpackedResolverWithArgs {
    case (_, UserSolution(_, _, true, _), _) => Future.failed(UserFacingGraphQLError("Correction was already finished!"))
    case (GraphQLContext(_, tableDefs, _, _ec), UserSolution(username, exerciseId, false, _), args) =>
      implicit val ec = _ec
      val comment     = args.arg(commentArgument)
      val points      = args.arg(pointsArgument)

      for {
        _ <- tableDefs.futureUpsertCorrectionResult(username, exerciseId, comment, points)
      } yield DbCorrectionSummary(exerciseId, username, comment, points)
  }

  private val resolveFinishCorrection: Resolver[UserSolution, Boolean] = unpackedResolver {
    case (_, userSolution) if userSolution.correctionFinished => Future.failed(UserFacingGraphQLError("Correction is already finished!"))
    case (GraphQLContext(_, tableDefs, _, _ec), userSolution) =>
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
