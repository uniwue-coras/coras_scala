package model.graphql

import model._
import model.userSolution.{UserSolution, UserSolutionKey}
import sangria.schema._

import scala.concurrent.Future

object RootQuery extends GraphQLBasics {

  private val resolveAllUsers: Resolver[Unit, Seq[User]] = unpackedResolverWithAdmin { case (_, tableDefs, _, _, _, _) =>
    tableDefs.futureAllUsers
  }

  private val resolveAbbreviations: Resolver[Unit, Seq[Abbreviation]] = unpackedResolverWithAdmin { case (_, tableDefs, _, _, _, _) =>
    tableDefs.futureAllAbbreviations
  }

  private val resolveAllRelatedWordGroups: Resolver[Unit, Seq[RelatedWordsGroup]] = unpackedResolverWithCorrector { case (_, tableDefs, _, _, _, _) =>
    tableDefs.futureAllRelatedWordGroups
  }

  private val resolveAllParagraphSynonyms: Resolver[Unit, Seq[ParagraphSynonym]] = unpackedResolverWithCorrector { case (_, tableDefs, _, _, _, _) =>
    tableDefs.futureAllParagraphSynonyms
  }

  private val resolveAllExercises: Resolver[Unit, Seq[Exercise]] = unpackedResolverWithUser { case (_, tableDefs, _, _, _, _) =>
    tableDefs.futureAllExercises
  }

  val resolveExercise: Resolver[Unit, Option[Exercise]] = unpackedResolverWithUser { case (_, tableDefs, _, _, _, args) =>
    tableDefs.futureMaybeExerciseById(args.arg(exerciseIdArg))
  }

  private val resolveReviewCorrection: Resolver[Unit, ReviewData] = unpackedResolverWithUser { case (_, tableDefs, _ec, _, user, args) =>
    implicit val ec = _ec
    val exerciseId  = args.arg(exerciseIdArg)

    for {
      maybeUserSolution <- tableDefs.futureMaybeUserSolution(UserSolutionKey(exerciseId, user.username))

      _ <- maybeUserSolution match {
        case None                              => Future.failed(UserFacingGraphQLError("No solution found..."))
        case Some(UserSolution(_, _, true, _)) => Future.successful(())
        case Some(UserSolution(_, _, _, _))    => Future.failed(UserFacingGraphQLError("Correction isn't finished yet!"))
      }

      userSolutionNodes   <- tableDefs.futureAllUserSolNodesForUserSolution(user.username, exerciseId)
      sampleSolutionNodes <- tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
      matches             <- tableDefs.futureMatchesForUserSolution(UserSolutionKey(exerciseId, user.username))

      maybeCorrectionSummary                   <- tableDefs.futureCorrectionSummaryForSolution(exerciseId, user.username)
      CorrectionSummary(_, _, comment, points) <- futureFromOption(maybeCorrectionSummary, UserFacingGraphQLError("Correction summary not found!"))

    } yield ReviewData(userSolutionNodes, sampleSolutionNodes, matches, comment, points)
  }

  private val resolveReviewCorrectionByUuid: Resolver[Unit, Option[ReviewData]] = unpackedResolverWithArgs { case (_, tableDefs, _ec, _, args) =>
    implicit val ec = _ec

    val uuid = args.arg(uuidArgument)

    for {
      maybeUserSolution <- tableDefs.futureSelectUserSolutionByReviewUuid(uuid)

      (exerciseId, username) <- maybeUserSolution match {
        case None                                              => Future.failed(UserFacingGraphQLError("No solution found..."))
        case Some(UserSolution(username, exerciseId, true, _)) => Future.successful((exerciseId, username))
        case Some(UserSolution(_, _, _, _))                    => Future.failed(UserFacingGraphQLError("Correction isn't finished yet!"))
      }

      userSolutionNodes   <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
      sampleSolutionNodes <- tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
      matches             <- tableDefs.futureMatchesForUserSolution(UserSolutionKey(exerciseId, username))

      maybeCorrectionSummary                   <- tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
      CorrectionSummary(_, _, comment, points) <- futureFromOption(maybeCorrectionSummary, UserFacingGraphQLError("Correction summary not found!"))

    } yield Some(ReviewData(userSolutionNodes, sampleSolutionNodes, matches, comment, points))
  }

  private val resolveMySolutions: Resolver[Unit, Seq[SolutionIdentifier]] = unpackedResolverWithUser { case (_, tableDefs, _, _, user, _) =>
    tableDefs.futureSelectMySolutionIdentifiers(user.username)
  }

  val queryType: ObjectType[GraphQLContext, Unit] = ObjectType(
    "Query",
    fields[GraphQLContext, Unit](
      Field("users", ListType(UserGraphQLTypes.queryType), resolve = resolveAllUsers),
      Field("abbreviations", ListType(AbbreviationGraphQLTypes.queryType), resolve = resolveAbbreviations),
      Field("relatedWordGroups", ListType(RelatedWordsGroupGraphQLTypes.queryType), resolve = resolveAllRelatedWordGroups),
      Field("paragraphSynonyms", ListType(ParagraphSynonym.queryType), resolve = resolveAllParagraphSynonyms),
      Field("exercises", ListType(Exercise.queryType), resolve = resolveAllExercises),
      Field("exercise", OptionType(Exercise.queryType), arguments = exerciseIdArg :: Nil, resolve = resolveExercise),
      Field("mySolutions", ListType(SolutionIdentifierGraphQLTypes.queryType), resolve = resolveMySolutions),
      Field("reviewCorrection", ReviewDataGraphqlTypes.queryType, arguments = exerciseIdArg :: Nil, resolve = resolveReviewCorrection),
      Field("reviewCorrectionByUuid", OptionType(ReviewDataGraphqlTypes.queryType), arguments = uuidArgument :: Nil, resolve = resolveReviewCorrectionByUuid)
    )
  )
}
