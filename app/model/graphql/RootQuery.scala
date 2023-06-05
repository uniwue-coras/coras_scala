package model.graphql

import model._
import model.graphql.GraphQLArguments.exerciseIdArg
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

trait RootQuery extends GraphQLBasics {

  protected implicit val ec: ExecutionContext

  private val resolveAllUsers: Resolver[Unit, Seq[User]] = resolveWithAdmin { (context, _) =>
    context.ctx.tableDefs.futureAllUsers
  }

  private val resolveAbbreviations: Resolver[Unit, Seq[Abbreviation]] = resolveWithAdmin { (context, _) => context.ctx.tableDefs.futureAllAbbreviations }

  private val resolveAllRelatedWordGroups: Resolver[Unit, Seq[RelatedWordsGroup]] = resolveWithUser { (context, _) =>
    context.ctx.tableDefs.futureAllRelatedWordGroups
  }

  private val resolveAllExercises: Resolver[Unit, Seq[Exercise]] = resolveWithUser { (context, _) =>
    context.ctx.tableDefs.futureAllExercises
  }

  private val resolveExercise: Resolver[Unit, Exercise] = resolveWithUser { (context, _) =>
    for {
      exerciseId    <- futureFromOption(context.argOpt(exerciseIdArg), UserFacingGraphQLError("Missing argument!"))
      maybeExercise <- context.ctx.tableDefs.futureMaybeExerciseById(exerciseId)
      result        <- futureFromOption(maybeExercise, UserFacingGraphQLError("No such exercise!"))
    } yield result
  }

  private val resolveReviewCorrection: Resolver[Unit, ReviewData] = resolveWithUser { case (context, user) =>
    val username   = user.username
    val exerciseId = context.arg(exerciseIdArg)

    for {
      maybeUserSolution <- context.ctx.tableDefs.futureMaybeUserSolution(username, exerciseId)

      _ <- maybeUserSolution match {
        case None                                                   => Future.failed(UserFacingGraphQLError("No solution found..."))
        case Some(UserSolution(_, _, CorrectionStatus.Finished, _)) => Future.successful(())
        case Some(UserSolution(_, _, _, _))                         => Future.failed(UserFacingGraphQLError("Correction isn't finished yet!"))
      }

      userSolutionNodes   <- context.ctx.tableDefs.futureNodesForUserSolution(username, exerciseId)
      sampleSolutionNodes <- context.ctx.tableDefs.futureSampleSolutionForExercise(exerciseId)
      matches             <- context.ctx.tableDefs.futureMatchesForUserSolution(username, exerciseId)

    } yield ReviewData(userSolutionNodes, sampleSolutionNodes, matches)
  }

  private val resolveMySolutions: Resolver[Unit, Seq[SolutionIdentifier]] = resolveWithUser { (context, user) =>
    context.ctx.tableDefs.futureSelectMySolutionIdentifiers(user.username)
  }

  protected val queryType: ObjectType[GraphQLContext, Unit] = ObjectType(
    "Query",
    fields[GraphQLContext, Unit](
      Field("users", ListType(UserGraphQLTypes.queryType), resolve = resolveAllUsers),
      Field("exercises", ListType(ExerciseGraphQLTypes.exerciseQueryType), resolve = resolveAllExercises),
      Field("exercise", ExerciseGraphQLTypes.exerciseQueryType, arguments = exerciseIdArg :: Nil, resolve = resolveExercise),
      Field("reviewCorrection", ReviewDataGraphqlTypes.queryType, arguments = exerciseIdArg :: Nil, resolve = resolveReviewCorrection),
      Field("abbreviations", ListType(AbbreviationGraphQLTypes.queryType), resolve = resolveAbbreviations),
      Field("relatedWordGroups", ListType(RelatedWordsGroupGraphQLTypes.queryType), resolve = resolveAllRelatedWordGroups),
      Field("mySolutions", ListType(SolutionIdentifierGraphQLTypes.queryType), resolve = resolveMySolutions)
    )
  )

}
