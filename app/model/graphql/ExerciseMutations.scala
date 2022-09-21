package model.graphql

import model.Exercise
import sangria.schema.{BooleanType, Field, ObjectType, fields}

import scala.concurrent.ExecutionContext

trait ExerciseMutations extends GraphQLArguments with GraphQLBasics {

  protected implicit val ec: ExecutionContext

  private val resolveSubmitSolution: Resolver[Exercise, Boolean] = resolveWithUser { (context, user) =>
    val GraphQLUserSolutionInput(maybeUsername, solutionAsJson) = context.arg(userSolutionInputArg)

    for {
      solution <- readSolutionFromJsonString(solutionAsJson)
      username = maybeUsername.getOrElse(user.username)
      inserted <- context.ctx.tableDefs.futureInsertUserSolution(username, context.value.id, solution)
    } yield inserted
  }

  private val resolveSubmitCorrection: Resolver[Exercise, Boolean] = resolveWithUser { (context, _) =>
    val GraphQLCorrectionInput(username, correctionAsJson) = context.arg(correctionInputArg)

    for {
      correction <- readCorrectionFromJsonString(correctionAsJson)
      _          <- context.ctx.tableDefs.futureDeleteUserSolution(context.value.id, username)
      _          <- context.ctx.tableDefs.futureDeleteCorrection(context.value.id, username)
      inserted   <- context.ctx.tableDefs.futureInsertCorrection(context.value.id, username, correction)
    } yield inserted
  }

  val exerciseMutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolution", BooleanType, arguments = userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("submitCorrection", BooleanType, arguments = correctionInputArg :: Nil, resolve = resolveSubmitCorrection)
    )
  )

}
