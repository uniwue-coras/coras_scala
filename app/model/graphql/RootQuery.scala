package model.graphql

import model._
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

trait RootQuery extends GraphQLBasics:
  self: GraphQLModel =>

  protected implicit val ec: ExecutionContext

  private val resolveAllUsers: Resolver[Unit, Seq[User]] = resolveWithAdmin { (context, _) => context.ctx.tableDefs.futureAllUsers }

  private val resolveAbbreviations: Resolver[Unit, Seq[Abbreviation]] = resolveWithAdmin { (context, _) => context.ctx.tableDefs.futureAllAbbreviations }

  private val resolveAllRelatedWordGroups: Resolver[Unit, Seq[RelatedWordsGroup]] = resolveWithUser { (context, _) =>
    context.ctx.tableDefs.futureAllRelatedWordGroups
  }

  private val resolveAllParagraphSynonyms: Resolver[Unit, Seq[ParagraphSynonym]] = resolveWithUser { (context, _) =>
    context.ctx.tableDefs.futureAllParagraphSynonyms
  }

  private val resolveAllExercises: Resolver[Unit, Seq[Exercise]] = resolveWithUser { (context, _) => context.ctx.tableDefs.futureAllExercises }

  val resolveExercise: Resolver[Unit, Option[Exercise]] = resolveWithUser { (context, _) =>
    context.ctx.tableDefs.futureMaybeExerciseById(context.arg(exerciseIdArg))
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

      userSolutionNodes   <- context.ctx.tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
      sampleSolutionNodes <- context.ctx.tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
      matches             <- context.ctx.tableDefs.futureMatchesForUserSolution(username, exerciseId)

      maybeCorrectionSummary                     <- context.ctx.tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
      DbCorrectionSummary(_, _, comment, points) <- futureFromOption(maybeCorrectionSummary, UserFacingGraphQLError("Correction summary not found!"))

    } yield ReviewData(userSolutionNodes, sampleSolutionNodes, matches, comment, points)
  }

  private val resolveReviewCorrectionByUuid: Resolver[Unit, Option[ReviewData]] = context => {
    val uuid = context.arg(uuidArgument)

    for {
      maybeUserSolution <- context.ctx.tableDefs.futureSelectUserSolutionByReviewUuid(uuid)

      (exerciseId, username) <- maybeUserSolution match {
        case None                                                                   => Future.failed(UserFacingGraphQLError("No solution found..."))
        case Some(UserSolution(username, exerciseId, CorrectionStatus.Finished, _)) => Future.successful((exerciseId, username))
        case Some(UserSolution(_, _, _, _))                                         => Future.failed(UserFacingGraphQLError("Correction isn't finished yet!"))
      }

      userSolutionNodes   <- context.ctx.tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
      sampleSolutionNodes <- context.ctx.tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
      matches             <- context.ctx.tableDefs.futureMatchesForUserSolution(username, exerciseId)

      maybeCorrectionSummary                     <- context.ctx.tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
      DbCorrectionSummary(_, _, comment, points) <- futureFromOption(maybeCorrectionSummary, UserFacingGraphQLError("Correction summary not found!"))

    } yield Some(ReviewData(userSolutionNodes, sampleSolutionNodes, matches, comment, points))
  }

  private val resolveMySolutions: Resolver[Unit, Seq[SolutionIdentifier]] = resolveWithUser { (context, user) =>
    context.ctx.tableDefs.futureSelectMySolutionIdentifiers(user.username)
  }

  protected val queryType: ObjectType[GraphQLContext, Unit] = ObjectType(
    "Query",
    fields[GraphQLContext, Unit](
      Field("users", ListType(UserGraphQLTypes.queryType), resolve = resolveAllUsers),
      Field("exercises", ListType(Exercise.queryType), resolve = resolveAllExercises),
      Field("exercise", OptionType(Exercise.queryType), arguments = exerciseIdArg :: Nil, resolve = resolveExercise),
      Field("abbreviations", ListType(AbbreviationGraphQLTypes.queryType), resolve = resolveAbbreviations),
      Field("relatedWordGroups", ListType(RelatedWordsGroupGraphQLTypes.queryType), resolve = resolveAllRelatedWordGroups),
      Field("paragraphSynonyms", ListType(ParagraphSynonym.queryType), resolve = resolveAllParagraphSynonyms),
      Field("mySolutions", ListType(SolutionIdentifierGraphQLTypes.queryType), resolve = resolveMySolutions),
      Field("reviewCorrection", ReviewDataGraphqlTypes.queryType, arguments = exerciseIdArg :: Nil, resolve = resolveReviewCorrection),
      Field("reviewCorrectionByUuid", OptionType(ReviewDataGraphqlTypes.queryType), arguments = uuidArgument :: Nil, resolve = resolveReviewCorrectionByUuid)
    )
  )
