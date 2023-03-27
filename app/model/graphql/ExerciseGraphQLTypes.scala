package model.graphql

import model._
import model.graphql.GraphQLArguments.{userSolutionInputArg, usernameArg}
import sangria.macros.derive.{AddFields, deriveInputObjectType, deriveObjectType}
import sangria.schema._

import scala.concurrent.ExecutionContext

object ExerciseGraphQLTypes extends GraphQLBasics {

  private implicit val ec: ExecutionContext = ExecutionContext.global

  // Input types

  val graphQLExerciseInputType: InputObjectType[ExerciseInput] = {
    // noinspection ScalaUnusedSymbol
    implicit val x0: InputObjectType[FlatSolutionNodeInput] = FlatSolutionNodeGraphQLTypes.flatSolutionNodeInputType

    deriveInputObjectType[ExerciseInput]()
  }

  // Queries

  private val resolveSampleSolution: Resolver[Exercise, Seq[FlatSampleSolutionNode]] = resolveWithUser { (context, _) =>
    context.ctx.tableDefs.futureSampleSolutionForExercise(context.value.id)
  }

  private val resolveAllUserSolutions: Resolver[Exercise, Seq[UserSolution]] = resolveWithCorrector { (context, _) =>
    context.ctx.tableDefs.futureUserSolutionsForExercise(context.value.id)
  }

  private val resolveUserSolution: Resolver[Exercise, UserSolution] = resolveWithCorrector { (context, _) =>
    val username = context.arg(usernameArg)

    for {
      maybeUserSolution <- context.ctx.tableDefs.futureMaybeUserSolution(username, context.value.id)
      userSolution      <- futureFromOption(maybeUserSolution, UserFacingGraphQLError(s"No solution for user $username"))
    } yield userSolution
  }

  val exerciseQueryType: ObjectType[GraphQLContext, Exercise] = deriveObjectType(
    AddFields[GraphQLContext, Exercise](
      Field("sampleSolution", ListType(FlatSolutionNodeGraphQLTypes.flatSampleSolutionGraphQLType), resolve = resolveSampleSolution),
      Field("userSolutions", ListType(UserSolutionGraphQLTypes.queryType), resolve = resolveAllUserSolutions),
      Field("userSolution", UserSolutionGraphQLTypes.queryType, arguments = usernameArg :: Nil, resolve = resolveUserSolution)
    )
  )

  // Mutations

  private val resolveSubmitSolution: Resolver[Exercise, Boolean] = resolveWithUser { (context, _) =>
    val UserSolutionInput(username, flatSolution) = context.arg(userSolutionInputArg)

    for {
      _ <- context.ctx.tableDefs.futureInsertUserSolutionForExercise(username, context.value.id, flatSolution)
    } yield true
  }

  val exerciseMutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolution", BooleanType, arguments = userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("userSolution", UserSolutionGraphQLTypes.mutationType, arguments = usernameArg :: Nil, resolve = resolveUserSolution)
    )
  )

}
