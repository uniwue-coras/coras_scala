package model.graphql

import model._
import model.matching.WordAnnotator
import model.matching.nodeMatching.{SolutionTree, TreeMatcher}
import sangria.macros.derive.deriveInputObjectType
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

object UserSolutionGraphQLTypes extends GraphQLBasics:

  // Input type

  val inputType: InputObjectType[UserSolutionInput] = {
    implicit val x0: InputObjectType[FlatSolutionNodeInput] = FlatSolutionNodeInputGraphQLTypes.inputType

    deriveInputObjectType[UserSolutionInput]()
  }

  // Queries

  private val resolveNodes: Resolver[UserSolution, Seq[FlatUserSolutionNode]] = unpackedResolver {
    case (GraphQLContext(tableDefs, _, _), UserSolution(username, exerciseId, _, _)) => tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
  }

  private val resolveNode: Resolver[UserSolution, Option[FlatUserSolutionNode]] = unpackedResolverWithArgs {
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
    case (GraphQLContext(tableDefs, _, _ec), UserSolution(username, exerciseId, _, _)) =>
      implicit val ec = _ec

      for {
        abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
        relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

        wordAnnotator = WordAnnotator(abbreviations, relatedWordGroups.map { _.content })

        sampleSolutionNodes <- tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
        userSolutionNodes   <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)

        sampleSolutionTree = SolutionTree.buildWithAnnotator(wordAnnotator, sampleSolutionNodes)
        userSolutionTree   = SolutionTree.buildWithAnnotator(wordAnnotator, userSolutionNodes)

        matches = TreeMatcher.performMatching(sampleSolutionTree, userSolutionTree)

        annotations = Seq.empty

      } yield CorrectionResult(matches, Seq.empty)
  }

  /** FIXME: implement! */
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
      Field("nodes", ListType(FlatUserSolutionNodeGraphQLTypes.queryType), resolve = resolveNodes),
      Field("node", OptionType(FlatUserSolutionNodeGraphQLTypes.queryType), arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveNode),
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
        abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
        relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

        wordAnnotator = WordAnnotator(abbreviations, relatedWordGroups.map { _.content })

        sampleSolutionNodes <- tableDefs.futureAllSampleSolNodesForExercise(exerciseId)
        userSolutionNodes   <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)

        sampleSolutionTree = SolutionTree.buildWithAnnotator(wordAnnotator, sampleSolutionNodes)
        userSolutionTree   = SolutionTree.buildWithAnnotator(wordAnnotator, userSolutionNodes)

        defaultMatches = TreeMatcher.performMatching(sampleSolutionTree, userSolutionTree)

        dbMatches = defaultMatches.map { case DefaultSolutionNodeMatch(sampleNodeId, userNodeId, maybeExplanation) =>
          DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, MatchStatus.Automatic, maybeExplanation.map(_.certainty))
        }

        annotations <- DbAnnotationGenerator(username, exerciseId, tableDefs).generateAnnotations(userSolutionNodes, dbMatches)

        newCorrectionStatus <- tableDefs.futureInsertCorrection(exerciseId, username, dbMatches, annotations)
      } yield newCorrectionStatus
  }

  private val resolveUserSolutionNode: Resolver[UserSolution, Option[FlatUserSolutionNode]] = unpackedResolverWithArgs {
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
      Field("node", OptionType(UserSolutionNode.mutationType), arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveUserSolutionNode),
      Field(
        "updateCorrectionResult",
        CorrectionSummaryGraphQLTypes.queryType,
        arguments = commentArgument :: pointsArgument :: Nil,
        resolve = resolveUpdateCorrectionResult
      ),
      Field("finishCorrection", CorrectionStatus.graphQLType, resolve = resolveFinishCorrection)
    )
  )
