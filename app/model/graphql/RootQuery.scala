package model.graphql

import model.graphql.GraphQLArguments.{correctionReviewUuidArgument, exerciseIdArg}
import model.{CorrectionStatus, Exercise, UserSolution}
import sangria.schema.{Field, ListType, ObjectType, fields}

import scala.concurrent.{ExecutionContext, Future}

trait RootQuery extends GraphQLBasics {

  protected implicit val ec: ExecutionContext

  private val resolveAllExercises: Resolver[Unit, Seq[Exercise]] = resolveWithUser { (context, _) => context.ctx.tableDefs.futureAllExercises }

  private val resolveExercise: Resolver[Unit, Exercise] = resolveWithUser { (context, _) =>
    for {
      exerciseId    <- futureFromOption(context.argOpt(exerciseIdArg), UserFacingGraphQLError("Missing argument!"))
      maybeExercise <- context.ctx.tableDefs.futureMaybeExerciseById(exerciseId)
      result        <- futureFromOption(maybeExercise, UserFacingGraphQLError("No such exercise!"))
    } yield result
  }

  private val resolveReviewCorrection: Resolver[Unit, ReviewData] = context =>
    for {
      maybeUserSolution <- context.ctx.tableDefs.futureUserSolutionByReviewUuid(context.arg(correctionReviewUuidArgument))

      UserSolution(username, exerciseId, correctionStatus, _) <- maybeUserSolution match {
        case None               => Future.failed(UserFacingGraphQLError("No data found..."))
        case Some(userSolution) => Future.successful(userSolution)
      }

      _ <- correctionStatus match {
        case CorrectionStatus.Finished => Future.successful(())
        case _                         => Future.failed(UserFacingGraphQLError("Correction isn't finished yet!"))
      }

      userSolutionNodes   <- context.ctx.tableDefs.futureNodesForUserSolution(username, exerciseId)
      sampleSolutionNodes <- context.ctx.tableDefs.futureSampleSolutionForExercise(exerciseId)
      matches             <- context.ctx.tableDefs.futureMatchesForUserSolution(username, exerciseId)

    } yield ReviewData(userSolutionNodes, sampleSolutionNodes, matches)

  protected val queryType: ObjectType[GraphQLContext, Unit] = ObjectType(
    "Query",
    fields[GraphQLContext, Unit](
      Field("exercises", ListType(ExerciseGraphQLTypes.exerciseQueryType), resolve = resolveAllExercises),
      Field("exercise", ExerciseGraphQLTypes.exerciseQueryType, arguments = exerciseIdArg :: Nil, resolve = resolveExercise),
      Field("reviewCorrection", ReviewDataGraphqlTypes.queryType, arguments = correctionReviewUuidArgument :: Nil, resolve = resolveReviewCorrection)
    )
  )

}
