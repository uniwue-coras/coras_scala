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
      Field("nodes", ListType(FlatSolutionNodeGraphQLTypes.flatUserSolutionQueryType), resolve = resolveNodes),
      Field("matches", ListType(SolutionNodeMatchGraphQLTypes.queryType), resolve = resolveMatches)
    )
  )

  // Mutations

  private val resolveInitiateCorrection: Resolver[UserSolution, CorrectionStatus] = context => {

    val UserSolution(username, exerciseId, correctionStatus) = context.value

    for {
      _ <- correctionStatus match {
        case CorrectionStatus.Waiting => Future.successful(())
        case _                        => Future.failed(UserFacingGraphQLError("Already done..."))
      }

      sampleSolution <- context.ctx.tableDefs.futureSampleSolutionForExercise(exerciseId)
      userSolution   <- context.ctx.tableDefs.futureNodesForUserSolution(username, exerciseId)

      abbreviations      <- context.ctx.tableDefs.futureAllAbbreviations()
      synonymAntonymBags <- context.ctx.tableDefs.futureAllSynonymAntonymBags()

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

  val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutations",
    fields[GraphQLContext, UserSolution](
      Field("initiateCorrection", CorrectionStatus.graphQLType, resolve = resolveInitiateCorrection),
      Field("node", UserSolutionNodeGraphQLTypes.userSolutionNodeMutationType, arguments = userSolutionNodeIdArgument :: Nil, resolve = resolveUserSolutionNode)
    )
  )

}
