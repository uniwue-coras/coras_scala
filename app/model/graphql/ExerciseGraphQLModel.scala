package model.graphql

import model._
import model.matching.{CertainNodeMatch, FuzzyNodeMatch, NodeMatchingResult, TreeMatcher}
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
        "flatSampleSolution",
        ListType(SolutionTree.flatSolutionGraphQLType),
        resolve = context => SolutionTree.flattenTree(context.value.sampleSolution)
      ),
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
        "flatUserSolution",
        OptionType(ListType(SolutionTree.flatSolutionGraphQLType)),
        arguments = usernameArg :: Nil,
        resolve = implicit context =>
          withCorrectorUser { _ =>
            for {
              maybeMongoSolution <- context.ctx.mongoQueries.futureUserSolutionForExercise(context.value.id, context.arg(usernameArg))

              maybeSolution = maybeMongoSolution.map { ms => SolutionTree.flattenTree(ms.solution) }
            } yield maybeSolution
          }
      ),
      Field(
        "solutionForUserAsJson",
        OptionType(StringType),
        arguments = usernameArg :: Nil,
        deprecationReason = Some("Will be removed!"),
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
        deprecationReason = Some("Will be removed!"),
        resolve = implicit context =>
          withCorrectorUser { _ =>
            for {
              maybeMongoCorrection <- context.ctx.mongoQueries.futureCorrectionForExerciseAndUser(context.value.id, context.arg(usernameArg))

              maybeCorrection = maybeMongoCorrection.map { correction =>
                Json.stringify(Json.toJson(correction)(Correction.correctionJsonFormat))
              }
            } yield maybeCorrection
          }
      ),
      Field(
        "flatCorrectionForUser",
        SolutionTree.flatCorrectionGraphQLType,
        arguments = usernameArg :: Nil,
        resolve = implicit context =>
          withCorrectorUser { _ =>
            val username = context.arg(usernameArg)

            context.ctx.mongoQueries.futureUserSolutionForExercise(context.value.id, username).flatMap {
              case None => Future.failed(UserFacingGraphQLError(s"No solution for user $username"))
              case Some(mongoUserSolution) =>
                val sampleSolution = SolutionTree.flattenTree(context.value.sampleSolution)
                val userSolution   = SolutionTree.flattenTree(mongoUserSolution.solution)

                val NodeMatchingResult(matches, notMatchedSample, notMatchedUser) = TreeMatcher.performMatching(sampleSolution, userSolution)

                val matchingResult: Seq[FlatSolutionNodeMatch] = matches.map {
                  case CertainNodeMatch(sampleValue, userValue)          => FlatSolutionNodeMatch(sampleValue, userValue)
                  case FuzzyNodeMatch(sampleValue, userValue, certainty) => FlatSolutionNodeMatch(sampleValue, userValue)
                }

                Future.successful(
                  FlatCorrection(
                    sampleSolution,
                    userSolution,
                    matchingResult
                  )
                )
            }
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

  private def resolveSubmitCorrection(context: Context[GraphQLContext, Exercise]): Future[Boolean] = withUser { _ =>
    context.arg(correctionInputArg) match {
      case GraphQLCorrectionInput(username, correctionAsJson) =>
        for {
          correction <- readCorrectionFromJsonString(correctionAsJson)
          _          <- context.ctx.mongoQueries.futureDeleteUserSolution(context.value.id, username)
          _          <- context.ctx.mongoQueries.futureDeleteCorrection(context.value.id, username)
          inserted   <- context.ctx.mongoQueries.futureInsertCorrection(context.value.id, username, correction)
        } yield inserted
    }
  }(context)

  val mutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolution", BooleanType, arguments = userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("submitCorrection", BooleanType, arguments = correctionInputArg :: Nil, resolve = resolveSubmitCorrection)
    )
  )
}
