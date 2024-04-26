package model.userSolution

import model._
import model.graphql.{GraphQLBasics, GraphQLContext, UserFacingGraphQLError}
import model.matching.SpacyWordAnnotator
import model.matching.nodeMatching.AnnotatedSampleSolutionTree
import sangria.schema.{BooleanType, Field, ObjectType, OptionType, fields}

import scala.concurrent.{ExecutionContext, Future}

object UserSolutionMutations extends GraphQLBasics:
  private val resolveInitiateCorrection: Resolver[UserSolution, CorrectionStatus] = unpackedResolver {
    case (_, UserSolution(_, _, correctionStatus, _)) if correctionStatus != CorrectionStatus.Waiting =>
      Future.failed(UserFacingGraphQLError("Already done..."))

    case (GraphQLContext(ws, tableDefs, _, given ExecutionContext), UserSolution(username, exerciseId, _, _)) =>
      for {
        CorrectionResult(matches, annotations, paragraphCitationAnnotations) <- UserSolution.correct(ws, tableDefs, exerciseId, username)

        dbMatches = matches.map { _.forDb(exerciseId, username) }

        dbAnnotations = annotations.map { _.forDb(exerciseId, username) }

        dbParagraphCitationAnnotations = paragraphCitationAnnotations.map { _.forDb(exerciseId, username) }

        newCorrectionStatus <- tableDefs.futureInsertCorrection(exerciseId, username, dbMatches, dbAnnotations, dbParagraphCitationAnnotations)
      } yield newCorrectionStatus
  }

  private val resolveUserSolutionNode: Resolver[UserSolution, Option[UserSolutionNode]] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, _), UserSolution(username, exerciseId, _, _), args) =>
      tableDefs.futureUserSolutionNodeForExercise(username, exerciseId, args.arg(userSolutionNodeIdArgument))
  }

  private val resolveCalculateCorrectnesses: Resolver[UserSolution, Boolean] = unpackedResolver {
    case (GraphQLContext(ws, tableDefs, _, given ExecutionContext), userSol) =>
      for {
        abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
        relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

        wordAnnotator = SpacyWordAnnotator(ws, abbreviations, relatedWordGroups.map { _.content })

        sampleSolutionNodes               <- tableDefs.futureAllSampleSolNodesForExercise(userSol.exerciseId)
        given AnnotatedSampleSolutionTree <- wordAnnotator.buildSampleSolutionTree(sampleSolutionNodes)

        completeUpdateData <- userSol.recalculateCorrectness(tableDefs, wordAnnotator)

        (correctnessUpdateData, paragraphCitationAnnotations) = completeUpdateData.foldLeft(
          Seq[(DbSolutionNodeMatch, (Correctness, Correctness))](),
          Seq[DbParagraphCitationAnnotation]()
        ) { case ((corrUpdateAcc, parCitAnnoAcc), (solNodeMatch, (parCitCorrectness, explCorrectness, parCitAnnos))) =>
          (
            corrUpdateAcc :+ (solNodeMatch -> (parCitCorrectness, explCorrectness)),
            parCitAnnoAcc ++ parCitAnnos
          )
        }

        _ <- tableDefs.futureUpdateCorrectness(correctnessUpdateData)
        _ <- tableDefs.futureUpsertParagraphCitationAnnotations(paragraphCitationAnnotations)
      } yield true
  }

  private val resolveUpdateCorrectionResult: Resolver[UserSolution, DbCorrectionSummary] = unpackedResolverWithArgs {
    case (_, UserSolution(_, _, CorrectionStatus.Waiting, _), _)  => Future.failed(UserFacingGraphQLError("Correction is not yet started!"))
    case (_, UserSolution(_, _, CorrectionStatus.Finished, _), _) => Future.failed(UserFacingGraphQLError("Correction was already finished!"))

    case (GraphQLContext(_, tableDefs, _, given ExecutionContext), UserSolution(username, exerciseId, _, _), args) =>
      val comment = args.arg(commentArgument)
      val points  = args.arg(pointsArgument)

      for {
        _ <- tableDefs.futureUpsertCorrectionResult(username, exerciseId, comment, points)
      } yield DbCorrectionSummary(exerciseId, username, comment, points)
  }

  private val resolveFinishCorrection: Resolver[UserSolution, CorrectionStatus] = unpackedResolver {
    case (_, UserSolution(_, _, CorrectionStatus.Waiting, _))  => Future.failed(UserFacingGraphQLError("Correction can't be finished!"))
    case (_, UserSolution(_, _, CorrectionStatus.Finished, _)) => Future.failed(UserFacingGraphQLError("Correction is already finished!"))

    case (GraphQLContext(_, tableDefs, _, given ExecutionContext), UserSolution(username, exerciseId, _, _)) =>
      val newCorrectionStatus = CorrectionStatus.Finished

      for {
        _ <- tableDefs.futureUpdateCorrectionStatus(exerciseId, username, newCorrectionStatus)
      } yield newCorrectionStatus
  }

  val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutations",
    fields[GraphQLContext, UserSolution](
      Field("initiateCorrection", CorrectionStatus.graphQLType, resolve = resolveInitiateCorrection),
      Field("node", OptionType(UserSolutionNodeMutations.mutationType), arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveUserSolutionNode),
      Field("calculateCorrectnesses", BooleanType, resolve = resolveCalculateCorrectnesses),
      Field(
        "updateCorrectionResult",
        CorrectionSummaryGraphQLTypes.queryType,
        arguments = commentArgument :: pointsArgument :: Nil,
        resolve = resolveUpdateCorrectionResult
      ),
      Field("finishCorrection", CorrectionStatus.graphQLType, resolve = resolveFinishCorrection)
    )
  )
