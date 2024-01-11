package model.graphql

import model._
import model.graphql.GraphQLArguments.{commentArgument, pointsArgument, userSolutionNodeIdArgument}
import model.matching.nodeMatching.TreeMatcher
import model.matching.paragraphMatching.ParagraphOnlyTreeMatcher
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}
import model.SolutionNodeMatchKey

object UserSolutionGraphQLTypes extends GraphQLBasics:

  // Queries

  private val resolveNodes: Resolver[UserSolution, Seq[FlatUserSolutionNode]] = context =>
    context.ctx.tableDefs.futureUserSolNodesForUserSolution(context.value.username, context.value.exerciseId)

  private val resolveNode: Resolver[UserSolution, Option[FlatUserSolutionNode]] = context =>
    context.ctx.tableDefs.futureUserSolutionNodeForExercise(context.value.username, context.value.exerciseId, context.arg(userSolutionNodeIdArgument))

  private val resolveMatches: Resolver[UserSolution, Seq[SolutionNodeMatch]] = context =>
    context.value.correctionStatus match {
      case CorrectionStatus.Waiting => Future.failed(UserFacingGraphQLError("Initial correction not yet performed!"))
      case _                        => context.ctx.tableDefs.futureMatchesForUserSolution(context.value.username, context.value.exerciseId)
    }

  private val resolveCorrectionSummary: Resolver[UserSolution, Option[(CorrectionSummaryKey, CorrectionSummary)]] = context =>
    context.ctx.tableDefs.futureCorrectionSummaryForSolution(context.value.exerciseId, context.value.username)

  private def resolvePerformCurrentCorrection(onlyParagraphMatching: Boolean): Resolver[UserSolution, Seq[DefaultSolutionNodeMatch]] = context => {
    implicit val ec: ExecutionContext                           = context.ctx.ec
    val UserSolution(username, exerciseId, correctionStatus, _) = context.value
    val tableDefs                                               = context.ctx.tableDefs

    for {
      sampleSolutionNodes <- tableDefs.futureSampleSolNodesForExercise(exerciseId)
      userSolutionNodes   <- tableDefs.futureUserSolNodesForUserSolution(username, exerciseId)

      abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
      relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

      matcher = if onlyParagraphMatching then ParagraphOnlyTreeMatcher else TreeMatcher(abbreviations, relatedWordGroups.map(_.content))

    } yield matcher.performMatching(sampleSolutionNodes, userSolutionNodes)
  }

  val queryType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolution",
    fields[GraphQLContext, UserSolution](
      Field("username", StringType, resolve = _.value.username),
      Field("correctionStatus", CorrectionStatus.graphQLType, resolve = _.value.correctionStatus),
      Field("nodes", ListType(FlatUserSolutionNode.queryType), resolve = resolveNodes),
      Field("node", OptionType(FlatUserSolutionNode.queryType), arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveNode),
      Field("matches", ListType(SolutionNodeMatchGraphQLTypes.queryType), resolve = resolveMatches),
      Field("correctionSummary", OptionType(CorrectionSummaryGraphQLTypes.queryType), resolve = resolveCorrectionSummary),
      Field("performCurrentCorrection", ListType(DefaultSolutionNodeMatch.queryType), resolve = resolvePerformCurrentCorrection(false)),
      Field("onlyParagraphMatchingCorrection", ListType(DefaultSolutionNodeMatch.queryType), resolve = resolvePerformCurrentCorrection(true))
    )
  )

  // Mutations

  private val resolveInitiateCorrection: Resolver[UserSolution, CorrectionStatus] = context => {
    implicit val ec: ExecutionContext                           = context.ctx.ec
    val UserSolution(username, exerciseId, correctionStatus, _) = context.value
    val tableDefs                                               = context.ctx.tableDefs

    for {
      _ <- correctionStatus match {
        case CorrectionStatus.Waiting => Future.successful(())
        case _                        => Future.failed(UserFacingGraphQLError("Already done..."))
      }

      sampleSolution <- tableDefs.futureSampleSolNodesForExercise(exerciseId)
      userSolution   <- tableDefs.futureUserSolNodesForUserSolution(username, exerciseId)

      abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
      relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

      treeMatcher = TreeMatcher(abbreviations, relatedWordGroups.map(_.content))

      foundMatches = treeMatcher.performMatching(sampleSolution, userSolution)

      annotations <- DbAnnotationGenerator(username, exerciseId, tableDefs).generateAnnotations(userSolution, foundMatches)

      dbMatches = foundMatches.map { case DefaultSolutionNodeMatch(sampleNodeId, userNodeId, maybeExplanation) =>
        (
          SolutionNodeMatchKey(username, exerciseId),
          SolutionNodeMatch(sampleNodeId, userNodeId, MatchStatus.Automatic, maybeExplanation.map(_.certainty))
        )
      }

      dbAnnotations = annotations.map { case (nodeId, annotation) => (NodeAnnotationKey(username, exerciseId, nodeId), annotation) }

      newCorrectionStatus <- tableDefs.futureInsertCorrection(exerciseId, username, dbMatches, dbAnnotations)
    } yield newCorrectionStatus
  }

  private val resolveUserSolutionNode: Resolver[UserSolution, FlatUserSolutionNode] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec
    val userSolutionNodeId            = context.arg(userSolutionNodeIdArgument)

    for {
      maybeNode <- context.ctx.tableDefs.futureUserSolutionNodeForExercise(context.value.username, context.value.exerciseId, userSolutionNodeId)
      node      <- futureFromOption(maybeNode, UserFacingGraphQLError(s"No user solution node with id $userSolutionNodeId"))
    } yield node
  }

  private val resolveUpdateCorrectionResult: Resolver[UserSolution, DbCorrectionSummary] = context => {
    implicit val ec: ExecutionContext                           = context.ctx.ec
    val UserSolution(username, exerciseId, correctionStatus, _) = context.value
    val comment                                                 = context.arg(commentArgument)
    val points                                                  = context.arg(pointsArgument)

    correctionStatus match {
      case CorrectionStatus.Waiting  => Future.failed(UserFacingGraphQLError("Correction is not yet started!"))
      case CorrectionStatus.Finished => Future.failed(UserFacingGraphQLError("Correction was already finished!"))
      case CorrectionStatus.Ongoing =>
        for {
          insertedOrUpdated <- context.ctx.tableDefs.futureUpsertCorrectionResult(username, exerciseId, comment, points)
          _                 <- futureFromBool(insertedOrUpdated, UserFacingGraphQLError("Couldn't upsert correction result!"))
        } yield (CorrectionSummaryKey(exerciseId, username), CorrectionSummary(comment, points))
    }
  }

  private val resolveFinishCorrection: Resolver[UserSolution, CorrectionStatus] = context => {
    implicit val ec: ExecutionContext                           = context.ctx.ec
    val UserSolution(username, exerciseId, correctionStatus, _) = context.value

    correctionStatus match {
      case CorrectionStatus.Waiting  => Future.failed(UserFacingGraphQLError("Correction can't be finished!"))
      case CorrectionStatus.Finished => Future.failed(UserFacingGraphQLError("Correction is already finished!"))
      case CorrectionStatus.Ongoing =>
        val newCorrectionStatus = CorrectionStatus.Finished

        for {
          _ <- context.ctx.tableDefs.futureUpdateCorrectionStatus(exerciseId, username, newCorrectionStatus)
        } yield newCorrectionStatus
    }
  }

  val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutations",
    fields[GraphQLContext, UserSolution](
      Field("initiateCorrection", CorrectionStatus.graphQLType, resolve = resolveInitiateCorrection),
      Field("node", UserSolutionNodeGraphQLMutations.mutationType, arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveUserSolutionNode),
      Field(
        "updateCorrectionResult",
        CorrectionSummaryGraphQLTypes.queryType,
        arguments = commentArgument :: pointsArgument :: Nil,
        resolve = resolveUpdateCorrectionResult
      ),
      Field("finishCorrection", CorrectionStatus.graphQLType, resolve = resolveFinishCorrection)
    )
  )
