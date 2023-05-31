package model.graphql

import model._
import model.graphql.GraphQLArguments.userSolutionNodeIdArgument
import model.matching._
import sangria.macros.derive.deriveInputObjectType
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

object UserSolutionGraphQLTypes extends GraphQLBasics {

  // noinspection ScalaUnusedSymbol
  private implicit val ec: ExecutionContext = ExecutionContext.global

  // Input type

  val inputType: InputObjectType[UserSolutionInput] = {
    // noinspection ScalaUnusedSymbol
    implicit val x0: InputObjectType[FlatSolutionNodeInput] = FlatSolutionNodeGraphQLTypes.flatSolutionNodeInputType

    deriveInputObjectType[UserSolutionInput]()
  }

  // Queries

  private val resolveNodes: Resolver[UserSolution, Seq[FlatUserSolutionNode]] = context =>
    context.ctx.tableDefs.futureNodesForUserSolution(context.value.username, context.value.exerciseId)

  private val resolveMatches: Resolver[UserSolution, Seq[SolutionNodeMatch]] = context =>
    context.value.correctionStatus match {
      case CorrectionStatus.Waiting => Future.failed(UserFacingGraphQLError("Initial correction not yet performed!"))
      case _                        => context.ctx.tableDefs.futureMatchesForUserSolution(context.value.username, context.value.exerciseId)
    }

  val queryType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolution",
    fields[GraphQLContext, UserSolution](
      Field("username", StringType, resolve = _.value.username),
      Field("correctionStatus", CorrectionStatus.graphQLType, resolve = _.value.correctionStatus),
      Field("reviewUuid", StringType, resolve = _.value.reviewUuid),
      Field("nodes", ListType(FlatSolutionNodeGraphQLTypes.flatUserSolutionQueryType), resolve = resolveNodes),
      Field("matches", ListType(SolutionNodeMatchGraphQLTypes.queryType), resolve = resolveMatches)
    )
  )

  // Mutations

  private val resolveInitiateCorrection: Resolver[UserSolution, CorrectionStatus] = context => {

    val UserSolution(username, exerciseId, correctionStatus, _) = context.value

    for {
      _ <- correctionStatus match {
        case CorrectionStatus.Waiting => Future.successful(())
        case _                        => Future.failed(UserFacingGraphQLError("Already done..."))
      }

      sampleSolution <- context.ctx.tableDefs.futureSampleSolutionForExercise(exerciseId)
      userSolution   <- context.ctx.tableDefs.futureNodesForUserSolution(username, exerciseId)

      abbreviations      <- context.ctx.tableDefs.futureAllAbbreviations
      synonymAntonymBags <- context.ctx.tableDefs.futureAllRelatedWordGroups

      matches = TreeMatcher.performMatching(username, exerciseId, sampleSolution, userSolution, abbreviations, synonymAntonymBags)

      newCorrectionStatus <- context.ctx.tableDefs.futureInsertCorrection(exerciseId, username, matches)
    } yield newCorrectionStatus
  }

  private val resolveUserSolutionNode: Resolver[UserSolution, FlatUserSolutionNode] = context => {
    val userSolutionNodeId = context.arg(userSolutionNodeIdArgument)

    for {
      maybeNode <- context.ctx.tableDefs.futureUserSolutionNodeForExercise(context.value.username, context.value.exerciseId, userSolutionNodeId)
      node      <- futureFromOption(maybeNode, UserFacingGraphQLError(s"No user solution node with id $userSolutionNodeId"))
    } yield node
  }

  private val resolveFinishCorrection: Resolver[UserSolution, CorrectionStatus] = context => {

    val UserSolution(username, exerciseId, correctionStatus, _) = context.value

    correctionStatus match {
      case CorrectionStatus.Waiting  => Future.failed(UserFacingGraphQLError("Correction can't be finished!"))
      case CorrectionStatus.Finished => Future.failed(UserFacingGraphQLError("Correction is already finished!"))
      case CorrectionStatus.Ongoing =>
        for {
          _ <- context.ctx.tableDefs.futureUpdateCorrectionStatus(exerciseId, username, CorrectionStatus.Finished)
        } yield CorrectionStatus.Finished
    }
  }

  val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutations",
    fields[GraphQLContext, UserSolution](
      Field("initiateCorrection", CorrectionStatus.graphQLType, resolve = resolveInitiateCorrection),
      Field("node", UserSolutionNodeGraphQLTypes.mutationType, arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveUserSolutionNode),
      Field("finishCorrection", CorrectionStatus.graphQLType, resolve = resolveFinishCorrection)
    )
  )

}
