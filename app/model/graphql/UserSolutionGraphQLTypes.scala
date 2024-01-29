package model.graphql

import model._
import model.graphql.GraphQLArguments.{commentArgument, pointsArgument, userSolutionNodeIdArgument}
import model.matching.nodeMatching.{BasicTreeMatcher, SolutionNodeContainerTreeBuilder}
import model.matching.paragraphMatching.ParagraphOnlyTreeMatcher
import model.matching.wordMatching.WordAnnotator
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

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

  private val resolveCorrectionSummary: Resolver[UserSolution, Option[DbCorrectionSummary]] = context =>
    context.ctx.tableDefs.futureCorrectionSummaryForSolution(context.value.exerciseId, context.value.username)

  private def resolvePerformCurrentCorrection(onlyParagraphMatching: Boolean): Resolver[UserSolution, Seq[DefaultSolutionNodeMatch]] = context => {
    implicit val ec: ExecutionContext                           = context.ctx.ec
    val UserSolution(username, exerciseId, correctionStatus, _) = context.value
    val tableDefs                                               = context.ctx.tableDefs

    for {
      abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
      relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

      treeBuilder = SolutionNodeContainerTreeBuilder(new WordAnnotator(abbreviations, relatedWordGroups.map { _.prepareForExport }))

      // load sample solution
      sampleSolutionNodes <- tableDefs.futureSampleSolNodesForExercise(exerciseId)
      sampleSubTextNodes  <- tableDefs.futureSampleSubTextNodesForExercise(exerciseId)
      sampleTree = treeBuilder.buildSolutionTree(sampleSolutionNodes, sampleSubTextNodes)

      // load user solutions
      userSolutionNodes <- tableDefs.futureUserSolNodesForUserSolution(username, exerciseId)
      userSubTextNodes  <- tableDefs.futureUserSubTextNodesForUserSolution(username, exerciseId)
      userTree = treeBuilder.buildSolutionTree(userSolutionNodes, userSubTextNodes)

      matcher = if onlyParagraphMatching then ParagraphOnlyTreeMatcher else BasicTreeMatcher()

    } yield matcher.performMatching(sampleTree, userTree)
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

      // load helper data
      abbreviations     <- tableDefs.futureAllAbbreviationsAsMap
      relatedWordGroups <- tableDefs.futureAllRelatedWordGroups

      treeBuilder = SolutionNodeContainerTreeBuilder(new WordAnnotator(abbreviations, relatedWordGroups.map { _.prepareForExport }))

      // load complete sample solution
      sampleSolutionNodes <- tableDefs.futureSampleSolNodesForExercise(exerciseId)
      sampleSubTexts      <- tableDefs.futureSampleSubTextNodesForExercise(exerciseId)
      sampleTree = treeBuilder.buildSolutionTree(sampleSolutionNodes, sampleSubTexts)

      // load user solution
      userSolution <- tableDefs.futureUserSolNodesForUserSolution(username, exerciseId)
      userSubTexts <- tableDefs.futureUserSubTextNodesForUserSolution(username, exerciseId)
      userTree = treeBuilder.buildSolutionTree(userSolution, userSubTexts)

      foundMatches = BasicTreeMatcher().performMatching(sampleTree, userTree)

      annotations <- DbAnnotationGenerator(username, exerciseId, tableDefs).generateAnnotations(userSolution, foundMatches)

      dbMatches = foundMatches.map { case DefaultSolutionNodeMatch(sampleNode, userNode, maybeExplanation) =>
        (
          SolutionNodeMatchKey(username, exerciseId),
          SolutionNodeMatch(sampleNode.id, userNode.id, MatchStatus.Automatic, maybeExplanation.map(_.certainty))
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
