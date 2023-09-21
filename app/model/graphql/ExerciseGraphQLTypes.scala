package model.graphql

import model._
import model.graphql.GraphQLArguments.{userSolutionInputArg, usernameArg}
import sangria.macros.derive.{AddFields, deriveInputObjectType, deriveObjectType}
import sangria.schema._

import scala.annotation.unused
import scala.concurrent.ExecutionContext

object ExerciseGraphQLTypes extends QueryType[Exercise] with MutationType[Exercise] with MyInputType[ExerciseInput] {

  @unused private implicit val x0: InputObjectType[FlatSolutionNodeInput] = FlatSolutionNodeInputGraphQLTypes.inputType

  override val inputType: InputObjectType[ExerciseInput] = deriveInputObjectType[ExerciseInput]()

  // Queries

  private val resolveSampleSolution: Resolver[Exercise, Seq[FlatSampleSolutionNode]] = resolveWithUser { (context, _) =>
    context.ctx.tableDefs.futureSampleSolutionForExercise(context.value.id)
  }

  private val resolveAllUserSolutions: Resolver[Exercise, Seq[UserSolution]] = resolveWithCorrector { (context, _) =>
    context.ctx.tableDefs.futureUserSolutionsForExercise(context.value.id)
  }

  private val resolveUserSolution: Resolver[Exercise, Option[UserSolution]] = resolveWithCorrector { (context, _) =>
    context.ctx.tableDefs.futureMaybeUserSolution(context.arg(usernameArg), context.value.id)
  }

  override val queryType: ObjectType[GraphQLContext, Exercise] = deriveObjectType(
    AddFields[GraphQLContext, Exercise](
      Field("sampleSolution", ListType(FlatSampleSolutionNodeGraphQLTypes.queryType), resolve = resolveSampleSolution),
      Field("userSolutions", ListType(UserSolutionGraphQLTypes.queryType), resolve = resolveAllUserSolutions),
      Field("userSolution", OptionType(UserSolutionGraphQLTypes.queryType), arguments = usernameArg :: Nil, resolve = resolveUserSolution)
    )
  )

  private val resolveSubmitSolution: Resolver[Exercise, Boolean] = resolveWithUser { (context, _) =>
    @unused implicit val ec: ExecutionContext     = context.ctx.ec
    val UserSolutionInput(username, flatSolution) = context.arg(userSolutionInputArg)

    for {
      _ <- context.ctx.tableDefs.futureInsertUserSolutionForExercise(username, context.value.id, flatSolution)
    } yield true
  }

  override val mutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolution", BooleanType, arguments = userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("userSolution", OptionType(UserSolutionGraphQLTypes.mutationType), arguments = usernameArg :: Nil, resolve = resolveUserSolution)
    )
  )

}
