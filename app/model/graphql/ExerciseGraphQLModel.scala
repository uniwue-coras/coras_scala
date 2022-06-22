package model.graphql

import model.{Correction, Exercise, SolutionNode, UserSolution}
import play.api.libs.json.{Json, OFormat, Writes}
import sangria.macros.derive.{AddFields, ReplaceField, deriveObjectType}
import sangria.schema.{BooleanType, Context, Field, ListType, ObjectType, OptionType, StringType, fields}

import scala.concurrent.{ExecutionContext, ExecutionContextExecutor, Future}

object ExerciseGraphQLModel extends GraphQLArguments with GraphQLBasics {

  private implicit val ec: ExecutionContextExecutor = ExecutionContext.global

  val queryType: ObjectType[GraphQLContext, Exercise] = deriveObjectType(
    ReplaceField(
      "sampleSolution",
      Field(
        "sampleSolutionAsJson",
        StringType,
        resolve = context =>
          Json.stringify(
            Json.toJson(context.value.sampleSolution)(Writes.seq(SolutionNode.solutionNodeJsonFormat))
          )
      )
    ),
    AddFields(
      Field(
        "solutionSubmitted",
        BooleanType,
        resolve = implicit context => withUser { user => context.ctx.mongoQueries.futureUserHasSubmittedSolution(context.value.id, user.username) }
      ),
      Field(
        "allUsersWithSolution",
        ListType(StringType),
        resolve = implicit context => withAdminUser { _ => context.ctx.mongoQueries.futureUsersWithSolution(context.value.id) }
      ),
      Field(
        "corrected",
        BooleanType,
        resolve = implicit context => withUser { user => context.ctx.mongoQueries.futureUserHasCorrection(context.value.id, user.username) }
      ),
      Field(
        "allUsersWithCorrection",
        ListType(StringType),
        resolve = implicit context => withAdminUser { _ => context.ctx.mongoQueries.futureUsersWithCorrection(context.value.id) }
      ),
      Field(
        "solutionForUserAsJson",
        OptionType(StringType),
        arguments = usernameArg :: Nil,
        resolve = implicit context =>
          withCorrectorUser { _ =>
            for {
              maybeMongoSolution <- context.ctx.mongoQueries.futureUserSolutionForExercise(context.value.id, context.arg(usernameArg))

              maybeSolution = maybeMongoSolution.map { mongoSolution =>
                implicit val x0: OFormat[SolutionNode] = SolutionNode.solutionNodeJsonFormat

                Json.stringify(Json.toJson(mongoSolution.solution))
              }
            } yield maybeSolution
          }
      ),
      Field(
        "correctionForUserAsJson",
        OptionType(StringType),
        arguments = usernameArg :: Nil,
        resolve = implicit context =>
          withCorrectorUser { _ =>
            for {
              maybeMongoCorrection <- context.ctx.mongoQueries.futureCorrectionForExerciseAndUser(context.value.id, context.arg(usernameArg))

              maybeCorrection = maybeMongoCorrection.map { correction =>
                Json.stringify(Json.toJson(correction)(Correction.correctionJsonFormat))
              }
            } yield maybeCorrection
          }
      )
    )
  )

  private def resolveSubmitSolution(context: Context[GraphQLContext, Exercise]): Future[Boolean] = withUser { user =>
    context.arg(userSolutionInputArg) match {
      case GraphQLUserSolutionInput(maybeUsername, solutionAsJson) =>
        for {
          solution <- readSolutionFromJsonString(solutionAsJson)

          username = maybeUsername.getOrElse(user.username)

          inserted <- context.ctx.mongoQueries.futureInsertCompleteUserSolution(UserSolution(username, context.value.id, solution))

        } yield inserted
    }
  }(context)

  private def resolveSolutionMutations(context: Context[GraphQLContext, Exercise]): Future[Option[UserSolution]] = ???

  val mutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolution", BooleanType, arguments = userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("solutionMutations", OptionType(UserSolutionGraphQLModel.mutationType), arguments = Nil, resolve = resolveSolutionMutations)
    )
  )
}
