package model.graphql

import model._
import model.graphql.GraphQLArguments.{commentArgument, pointsArgument, userSolutionNodeIdArgument}
import model.matching._
import sangria.macros.derive.deriveInputObjectType
import sangria.schema._

import scala.annotation.unused
import scala.concurrent.{ExecutionContext, Future}

object UserSolutionGraphQLTypes extends QueryType[UserSolution] with MutationType[UserSolution] with MyInputType[UserSolutionInput] {

  // Input type

  override val inputType: InputObjectType[UserSolutionInput] = {
    @unused implicit val x0: InputObjectType[FlatSolutionNodeInput] = FlatSolutionNodeGraphQLTypes.flatSolutionNodeInputType

    deriveInputObjectType[UserSolutionInput]()
  }

  // Queries

  private val resolveNodes: Resolver[UserSolution, Seq[FlatUserSolutionNode]] = context =>
    context.ctx.tableDefs.futureNodesForUserSolution(context.value.username, context.value.exerciseId)

  private val resolveNode: Resolver[UserSolution, Option[FlatUserSolutionNode]] = context =>
    context.ctx.tableDefs.futureUserSolutionNodeForExercise(context.value.username, context.value.exerciseId, context.arg(userSolutionNodeIdArgument))

  private val resolveMatches: Resolver[UserSolution, Seq[SolutionNodeMatch]] = context =>
    context.value.correctionStatus match {
      case CorrectionStatus.Waiting => Future.failed(UserFacingGraphQLError("Initial correction not yet performed!"))
      case _                        => context.ctx.tableDefs.futureMatchesForUserSolution(context.value.username, context.value.exerciseId)
    }

  private val resolveCorrectionSummary: Resolver[UserSolution, Option[CorrectionSummary]] = context =>
    context.ctx.tableDefs.futureCorrectionSummaryForSolution(context.value.exerciseId, context.value.username)

  override val queryType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolution",
    fields[GraphQLContext, UserSolution](
      Field("username", StringType, resolve = _.value.username),
      Field("correctionStatus", CorrectionStatus.graphQLType, resolve = _.value.correctionStatus),
      Field("nodes", ListType(FlatSolutionNodeGraphQLTypes.flatUserSolutionQueryType), resolve = resolveNodes),
      Field("node", OptionType(FlatSolutionNodeGraphQLTypes.flatUserSolutionQueryType), arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveNode),
      Field("matches", ListType(SolutionNodeMatchGraphQLTypes.queryType), resolve = resolveMatches),
      Field("correctionSummary", OptionType(CorrectionSummaryGraphQLTypes.queryType), resolve = resolveCorrectionSummary)
    )
  )

  // Mutations

  private val resolveInitiateCorrection: Resolver[UserSolution, CorrectionStatus] = context => {
    @unused implicit val ec: ExecutionContext                   = context.ctx.ec
    val UserSolution(username, exerciseId, correctionStatus, _) = context.value

    for {
      _ <- correctionStatus match {
        case CorrectionStatus.Waiting => Future.successful(())
        case _                        => Future.failed(UserFacingGraphQLError("Already done..."))
      }

      sampleSolution <- context.ctx.tableDefs.futureSampleSolutionForExercise(exerciseId)
      userSolution   <- context.ctx.tableDefs.futureNodesForUserSolution(username, exerciseId)

      abbreviations      <- context.ctx.tableDefs.futureAllAbbreviationsAsMap
      synonymAntonymBags <- context.ctx.tableDefs.futureAllRelatedWordGroups

      matches = TreeMatcher.performMatching(username, exerciseId, sampleSolution, userSolution, abbreviations, synonymAntonymBags)

      newCorrectionStatus <- context.ctx.tableDefs.futureInsertCorrection(exerciseId, username, matches)

      annotations <- AnnotationGenerator.generateAnnotations(exerciseId, username, sampleSolution, userSolution, matches)

      // TODO: save annotations!

    } yield newCorrectionStatus
  }

  private val resolveUserSolutionNode: Resolver[UserSolution, FlatUserSolutionNode] = context => {
    @unused implicit val ec: ExecutionContext = context.ctx.ec
    val userSolutionNodeId                    = context.arg(userSolutionNodeIdArgument)

    for {
      maybeNode <- context.ctx.tableDefs.futureUserSolutionNodeForExercise(context.value.username, context.value.exerciseId, userSolutionNodeId)
      node      <- futureFromOption(maybeNode, UserFacingGraphQLError(s"No user solution node with id $userSolutionNodeId"))
    } yield node
  }

  private val resolveUpdateCorrectionResult: Resolver[UserSolution, CorrectionSummary] = context => {
    @unused implicit val ec: ExecutionContext                   = context.ctx.ec
    val UserSolution(exerciseId, username, correctionStatus, _) = context.value
    val comment                                                 = context.arg(commentArgument)
    val points                                                  = context.arg(pointsArgument)

    correctionStatus match {
      case CorrectionStatus.Waiting  => Future.failed(UserFacingGraphQLError("Correction is not yet started!"))
      case CorrectionStatus.Finished => Future.failed(UserFacingGraphQLError("Correction was already finished!"))
      case CorrectionStatus.Ongoing =>
        for {
          upserted <- context.ctx.tableDefs.futureUpsertCorrectionResult(exerciseId, username, comment, points)
          _        <- futureFromBool(upserted, UserFacingGraphQLError("Couldn't upsert correction result!"))
        } yield CorrectionSummary(comment, points)
    }
  }

  private val resolveFinishCorrection: Resolver[UserSolution, CorrectionStatus] = context => {
    @unused implicit val ec: ExecutionContext                   = context.ctx.ec
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

  override val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutations",
    fields[GraphQLContext, UserSolution](
      Field("initiateCorrection", CorrectionStatus.graphQLType, resolve = resolveInitiateCorrection),
      Field("node", UserSolutionNodeGraphQLTypes.mutationType, arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveUserSolutionNode),
      Field(
        "updateCorrectionResult",
        CorrectionSummaryGraphQLTypes.queryType,
        arguments = commentArgument :: pointsArgument :: Nil,
        resolve = resolveUpdateCorrectionResult
      ),
      Field("finishCorrection", CorrectionStatus.graphQLType, resolve = resolveFinishCorrection)
    )
  )

}
