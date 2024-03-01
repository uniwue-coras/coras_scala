package model

import model.exporting.{ExportedUserSolution, NodeExportable}
import model.graphql.{GraphQLBasics, GraphQLContext, UserFacingGraphQLError}
import model.matching.nodeMatching.{SolutionTree, TreeMatcher}
import model.matching.{Match, WordAnnotator}
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

final case class UserSolution(
  username: String,
  exerciseId: Int,
  correctionStatus: CorrectionStatus,
  reviewUuid: Option[String]
) extends NodeExportable[ExportedUserSolution]:
  override def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedUserSolution] = for {
    userSolutionNodes         <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
    exportedUserSolutionNodes <- Future.traverse(userSolutionNodes) { _.exportData(tableDefs) }

    nodeMatches <- tableDefs.futureMatchesForUserSolution(username, exerciseId)
    exportedNodeMatches = nodeMatches.map { _.exportData }

    correctionSummary <- tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
    exportedCorrectionSummary = correctionSummary.map { _.exportData }
  } yield ExportedUserSolution(username, exportedUserSolutionNodes, exportedNodeMatches, correctionStatus, exportedCorrectionSummary)

object UserSolution extends GraphQLBasics:

  private def correct(tableDefs: TableDefs, exerciseId: Int, username: String)(implicit ec: ExecutionContext): Future[CorrectionResult] = for {
    abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
    relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

    wordAnnotator = WordAnnotator(abbreviations, relatedWordGroups.map { _.content })

    sampleSolutionNodes <- tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
    userSolutionNodes   <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)

    sampleSolution = SolutionTree.buildWithAnnotator(wordAnnotator, sampleSolutionNodes)
    userSolution   = SolutionTree.buildWithAnnotator(wordAnnotator, userSolutionNodes)

    defaultMatches = TreeMatcher
      .matchContainerTrees(sampleSolution, userSolution)
      .matches
      .map { DefaultSolutionNodeMatch.fromSolutionNodeMatch }
      .sortBy { _.sampleNodeId }

    annotations <- DbAnnotationGenerator(username, exerciseId, tableDefs).generateAnnotations(sampleSolution.nodes, userSolution.nodes, defaultMatches)

  } yield CorrectionResult(defaultMatches, annotations)

  // Queries

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
    case (GraphQLContext(tableDefs, _, _ec), UserSolution(username, exerciseId, _, _)) => correct(tableDefs, exerciseId, username)(_ec)
  }

  private val resolveParagraphCorrelation: Resolver[UserSolution, Seq[ParagraphCorrelation]] = unpackedResolver {
    case (GraphQLContext(tableDefs, _, _ec), UserSolution(username, exerciseId, _, _)) =>
      implicit val ec = _ec

      for {
        sampleSolutionNodes <- tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
        userSolutionNodes   <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
      } yield ParagraphCorrelation.resolve(sampleSolutionNodes, userSolutionNodes)
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
      Field("performCurrentCorrection", CorrectionResult.queryType, resolve = resolvePerformCurrentCorrection),
      Field("paragraphCorrelations", ListType(ParagraphCorrelation.queryType), resolve = resolveParagraphCorrelation)
    )
  )

  // Mutations

  private val resolveInitiateCorrection: Resolver[UserSolution, CorrectionStatus] = unpackedResolver {
    case (_, UserSolution(_, _, correctionStatus, _)) if correctionStatus != CorrectionStatus.Waiting =>
      Future.failed(UserFacingGraphQLError("Already done..."))

    case (GraphQLContext(tableDefs, _, _ec), UserSolution(username, exerciseId, _, _)) =>
      implicit val ec: ExecutionContext = _ec

      for {
        CorrectionResult(matches, annotations) <- correct(tableDefs, exerciseId, username)

        dbMatches = matches.map { case DefaultSolutionNodeMatch(sampleNodeId, userNodeId, maybeExplanation) =>
          DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, MatchStatus.Automatic, maybeExplanation.map(_.certainty))
        }

        dbAnnotations = annotations.map { case GeneratedAnnotation(nodeId, id, errorType, importance, startIndex, endIndex, text) =>
          DbAnnotation(username, exerciseId, nodeId, id, errorType, importance, startIndex, endIndex, text, AnnotationType.Automatic)
        }

        newCorrectionStatus <- tableDefs.futureInsertCorrection(exerciseId, username, dbMatches, dbAnnotations)
      } yield newCorrectionStatus
  }

  private val resolveUserSolutionNode: Resolver[UserSolution, Option[UserSolutionNode]] = unpackedResolverWithArgs {
    case (GraphQLContext(tableDefs, _, _), UserSolution(username, exerciseId, _, _), args) =>
      tableDefs.futureUserSolutionNodeForExercise(username, exerciseId, args.arg(userSolutionNodeIdArgument))
  }

  private val resolveUpdateCorrectionResult: Resolver[UserSolution, DbCorrectionSummary] = unpackedResolverWithArgs {
    case (_, UserSolution(_, _, CorrectionStatus.Waiting, _), _)  => Future.failed(UserFacingGraphQLError("Correction is not yet started!"))
    case (_, UserSolution(_, _, CorrectionStatus.Finished, _), _) => Future.failed(UserFacingGraphQLError("Correction was already finished!"))

    case (GraphQLContext(tableDefs, _, _ec), UserSolution(username, exerciseId, _, _), args) =>
      implicit val ec = _ec
      val comment     = args.arg(commentArgument)
      val points      = args.arg(pointsArgument)

      for {
        _ <- tableDefs.futureUpsertCorrectionResult(username, exerciseId, comment, points)
      } yield DbCorrectionSummary(exerciseId, username, comment, points)
  }

  private val resolveFinishCorrection: Resolver[UserSolution, CorrectionStatus] = unpackedResolver {
    case (_, UserSolution(_, _, CorrectionStatus.Waiting, _))  => Future.failed(UserFacingGraphQLError("Correction can't be finished!"))
    case (_, UserSolution(_, _, CorrectionStatus.Finished, _)) => Future.failed(UserFacingGraphQLError("Correction is already finished!"))

    case (GraphQLContext(tableDefs, _, _ec), UserSolution(username, exerciseId, _, _)) =>
      implicit val ec: ExecutionContext = _ec
      val newCorrectionStatus           = CorrectionStatus.Finished

      for {
        _ <- tableDefs.futureUpdateCorrectionStatus(exerciseId, username, newCorrectionStatus)
      } yield newCorrectionStatus
  }

  val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutations",
    fields[GraphQLContext, UserSolution](
      Field("initiateCorrection", CorrectionStatus.graphQLType, resolve = resolveInitiateCorrection),
      Field("node", OptionType(UserSolutionNodeMutations.mutationType), arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveUserSolutionNode),
      Field(
        "updateCorrectionResult",
        CorrectionSummaryGraphQLTypes.queryType,
        arguments = commentArgument :: pointsArgument :: Nil,
        resolve = resolveUpdateCorrectionResult
      ),
      Field("finishCorrection", CorrectionStatus.graphQLType, resolve = resolveFinishCorrection)
    )
  )
