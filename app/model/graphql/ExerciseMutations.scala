package model.graphql

import model.{Exercise, FlatUserSolutionNode}
import sangria.schema._

import scala.concurrent.Future

trait ExerciseMutations extends GraphQLArguments with GraphQLInputObjectTypes with JsonFormats with GraphQLBasics with UserSolutionNodeMutations {

  protected implicit val ec: scala.concurrent.ExecutionContext

  private val resolveUserSolutionNode: Resolver[Exercise, Option[FlatUserSolutionNode]] = context =>
    context.ctx.tableDefs.futureUserSolutionNodeForExercise(context.arg(usernameArg), context.value.id, context.arg(userSolutionNodeIdArgument))

  private val resolveSubmitSolution: Resolver[Exercise, Boolean] = resolveWithUser { (context, user) =>
    val GraphQLUserSolutionInput(maybeUsername, flatSolution) = context.arg(userSolutionInputArg)

    for {
      _ <- context.ctx.tableDefs.futureInsertUserSolutionForExercise(maybeUsername.getOrElse(user.username), context.value.id, flatSolution)
    } yield true
  }

  private val resolveSubmitCorrection: Resolver[Exercise, Boolean] = resolveWithUser { (context, _) =>
    val GraphQLCorrectionInput(username, correctionAsJson) = context.arg(correctionInputArg)

    for {
      correction /* :* SolutionNodeMatchingResult*/ <- Future.failed { new Exception("TODO: implement!") }
      _ /* oldCorrectionDeleted*/                   <- context.ctx.tableDefs.futureDeleteCorrection(context.value.id, username)
      _ /*inserted*/                                <- context.ctx.tableDefs.futureInsertCorrection(context.value.id, username, correction)
    } yield true
  }

  protected val exerciseMutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field(
        "userSolutionNode",
        OptionType(userSolutionNodeMutationType),
        arguments = usernameArg :: userSolutionNodeIdArgument :: Nil,
        resolve = resolveUserSolutionNode
      ),
      Field("submitSolution", BooleanType, arguments = userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("submitCorrection", BooleanType, arguments = correctionInputArg :: Nil, resolve = resolveSubmitCorrection)
    )
  )

}
