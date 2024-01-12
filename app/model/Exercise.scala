package model

import model.graphql.{GraphQLArguments, GraphQLBasics, GraphQLContext, Resolver, UserSolutionGraphQLTypes}
import sangria.macros.derive.{AddFields, deriveInputObjectType, deriveObjectType}
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}
import model.exporting.ExportedExercise

final case class ExerciseInput(
  title: String,
  text: String,
  sampleSolution: Seq[FlatSolutionNodeInput]
)

final case class Exercise(
  id: Int,
  title: String,
  text: String
) {

  def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedExercise] = for {
    sampleSolutionNodes         <- tableDefs.futureSampleSolNodesForExercise(id)
    exportedSampleSolutionNodes <- Future.traverse(sampleSolutionNodes) { _.exportData(tableDefs) }

    userSolutions         <- tableDefs.futureUserSolutionsForExercise(id)
    exportedUserSolutions <- Future.traverse(userSolutions) { _.exportData(tableDefs) }
  } yield ExportedExercise(id, title, text, exportedSampleSolutionNodes, exportedUserSolutions)

}

object Exercise extends GraphQLBasics:

  val inputType: InputObjectType[ExerciseInput] = {
    implicit val x0: InputObjectType[FlatSolutionNodeInput] = FlatSolutionNodeInputGraphQLTypes.inputType

    deriveInputObjectType[ExerciseInput]()
  }

  // Queries

  private val resolveSampleSolutionNodes: Resolver[Exercise, Seq[FlatSampleSolutionNode]] = resolveWithUser { (context, _) =>
    context.ctx.tableDefs.futureSampleSolNodesForExercise(context.value.id)
  }

  private val resolveAllUserSolutions: Resolver[Exercise, Seq[UserSolution]] = resolveWithCorrector { (context, _) =>
    context.ctx.tableDefs.futureUserSolutionsForExercise(context.value.id)
  }

  private val resolveUserSolution: Resolver[Exercise, Option[UserSolution]] = resolveWithCorrector { (context, _) =>
    context.ctx.tableDefs.futureMaybeUserSolution(context.arg(GraphQLArguments.usernameArg), context.value.id)
  }

  val queryType: ObjectType[GraphQLContext, Exercise] = deriveObjectType(
    AddFields[GraphQLContext, Exercise](
      Field("sampleSolutionNodes", ListType(FlatSampleSolutionNode.queryType), resolve = resolveSampleSolutionNodes),
      Field("userSolutions", ListType(UserSolutionGraphQLTypes.queryType), resolve = resolveAllUserSolutions),
      Field("userSolution", OptionType(UserSolutionGraphQLTypes.queryType), arguments = GraphQLArguments.usernameArg :: Nil, resolve = resolveUserSolution)
    )
  )

  private val resolveSubmitSolution: Resolver[Exercise, Boolean] = resolveWithUser { (context, _) =>
    implicit val ec: ExecutionContext = context.ctx.ec

    val UserSolutionInput(username, flatSolution) = context.arg(GraphQLArguments.userSolutionInputArg)

    for {
      _ <- context.ctx.tableDefs.futureInsertUserSolutionForExercise(username, context.value.id, flatSolution)
    } yield true
  }

  val mutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolution", BooleanType, arguments = GraphQLArguments.userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("userSolution", OptionType(UserSolutionGraphQLTypes.mutationType), arguments = GraphQLArguments.usernameArg :: Nil, resolve = resolveUserSolution)
    )
  )
