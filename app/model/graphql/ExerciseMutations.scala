package model.graphql

import model.Exercise
import sangria.schema.{BooleanType, Field, ObjectType, fields}

trait ExerciseMutations extends GraphQLArguments with GraphQLBasics {

  protected implicit val ec: scala.concurrent.ExecutionContext

  private val resolveSubmitSolution: Resolver[Exercise, Boolean] = resolveWithUser { (context, user) =>
    val GraphQLUserSolutionInput(maybeUsername, flatSolution) = context.arg(userSolutionInputArg)

    for {
      _ <- context.ctx.tableDefs.futureInsertUserSolutionForExercise(
        username = maybeUsername.getOrElse(user.username),
        exerciseId = context.value.id,
        userSolution = flatSolution
      )
    } yield true
  }

  private val resolveSubmitCorrection: Resolver[Exercise, Boolean] = resolveWithUser { (context, _) =>
    val GraphQLCorrectionInput(username, correctionAsJson) = context.arg(correctionInputArg)

    for {
      correction                  <- readCorrectionFromJsonString(correctionAsJson)
      _ /* oldCorrectionDeleted*/ <- context.ctx.tableDefs.futureDeleteCorrection(context.value.id, username)
      inserted                    <- context.ctx.tableDefs.futureInsertCorrection(context.value.id, username, correction)
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
