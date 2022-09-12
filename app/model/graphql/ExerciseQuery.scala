package model.graphql

import model._
import model.matching.{CertainNodeMatch, FuzzyNodeMatch, NodeMatchingResult, TreeMatcher}
import play.api.libs.json.{Json, OFormat, Writes}
import sangria.macros.derive.{AddFields, ReplaceField, deriveObjectType}
import sangria.schema.{BooleanType, EnumType, Field, ListType, ObjectType, OptionType, StringType}

import scala.concurrent.{ExecutionContext, Future}

trait ExerciseQuery extends GraphQLArguments with GraphQLBasics {

  protected implicit val ec: ExecutionContext

  // types

  private val flatSolutionGraphQLType: ObjectType[Unit, FlatSolutionNode] = {
    implicit val x0: EnumType[Applicability]               = Applicability.graphQLType
    implicit val x1: ObjectType[Unit, SolutionNodeSubText] = SolutionNodeSubText.graphQLType

    deriveObjectType()
  }

  private val flatSolutionNodeMatchGraphQLType: ObjectType[Unit, FlatSolutionNodeMatch] = deriveObjectType()

  private val flatCorrectionGraphQLType: ObjectType[Unit, FlatCorrection] = {
    implicit val x0: ObjectType[Unit, FlatSolutionNode]      = flatSolutionGraphQLType
    implicit val x1: ObjectType[Unit, FlatSolutionNodeMatch] = flatSolutionNodeMatchGraphQLType

    deriveObjectType()
  }

  // resolvers

  private val resolveFlatUserSolution: Resolver[Exercise, Option[Seq[FlatSolutionNode]]] = implicit context =>
    withCorrectorUser { _ =>
      for {
        maybeUserSolution <- context.ctx.tableDefs.futureUserSolutionForExercise(context.value.id, context.arg(usernameArg))

        maybeSolution = maybeUserSolution.map { ms => SolutionTree.flattenTree(ms.solution) }
      } yield maybeSolution
    }

  @deprecated()
  private val resolveSolutionForUserAsJson: Resolver[Exercise, Option[String]] = implicit context =>
    withCorrectorUser { _ =>
      for {
        maybeUserSolution <- context.ctx.tableDefs.futureUserSolutionForExercise(context.value.id, context.arg(usernameArg))

        maybeSolution = maybeUserSolution.map { mongoSolution =>
          implicit val x0: OFormat[SolutionNode] = SolutionNode.solutionNodeJsonFormat

          Json.stringify(Json.toJson(mongoSolution.solution))
        }
      } yield maybeSolution
    }

  @deprecated()
  private val resolveCorrectionForUserAsJson: Resolver[Exercise, Option[String]] = implicit context =>
    withCorrectorUser { _ =>
      for {
        maybeMongoCorrection <- context.ctx.tableDefs.futureCorrectionForExerciseAndUser(context.value.id, context.arg(usernameArg))

        maybeCorrection = maybeMongoCorrection.map { correction =>
          Json.stringify(Json.toJson(correction)(Correction.correctionJsonFormat))
        }
      } yield maybeCorrection
    }

  private val resolveFlatCorrectionForUser: Resolver[Exercise, FlatCorrection] = implicit context =>
    withCorrectorUser { _ =>
      val username = context.arg(usernameArg)

      for {
        maybeSol <- context.ctx.tableDefs.futureUserSolutionForExercise(context.value.id, username)

        completeUserSolution <- maybeSol match {
          case None                    => Future.failed(UserFacingGraphQLError(s"No solution for user $username"))
          case Some(mongoUserSolution) => Future.successful(mongoUserSolution)
        }

        sampleSolution = SolutionTree.flattenTree(context.value.sampleSolution)
        userSolution   = SolutionTree.flattenTree(completeUserSolution.solution)

        NodeMatchingResult(matches, notMatchedSample, notMatchedUser) = TreeMatcher.performMatching(sampleSolution, userSolution)

        matchingResult: Seq[FlatSolutionNodeMatch] = matches.map {
          case CertainNodeMatch(sampleValue, userValue)          => FlatSolutionNodeMatch(sampleValue, userValue)
          case FuzzyNodeMatch(sampleValue, userValue, certainty) => FlatSolutionNodeMatch(sampleValue, userValue)
        }

        result = FlatCorrection(sampleSolution, userSolution, matchingResult)
      } yield result
    }

  // query type

  val exerciseQueryType: ObjectType[GraphQLContext, Exercise] = deriveObjectType(
    // TODO: ExcludeFields("sampleSolution"),
    ReplaceField(
      "sampleSolution",
      Field(
        "sampleSolutionAsJson",
        StringType,
        resolve = context =>
          Json.stringify(
            Json.toJson(context.value.sampleSolution)(Writes.seq(SolutionNode.solutionNodeJsonFormat))
          ),
        deprecationReason = Some("TODO!")
      )
    ),
    AddFields[GraphQLContext, Exercise](
      Field(
        "flatSampleSolution",
        ListType(flatSolutionGraphQLType),
        resolve = implicit context => withUser { _ => Future.successful(SolutionTree.flattenTree(context.value.sampleSolution)) }
      ),
      Field(
        "solutionSubmitted",
        BooleanType,
        resolve = implicit context => withUser { user => context.ctx.tableDefs.futureUserHasSubmittedSolution(context.value.id, user.username) }
      ),
      Field(
        "allUsersWithSolution",
        ListType(StringType),
        resolve = implicit context => withAdminUser { _ => context.ctx.tableDefs.futureUsersWithSolution(context.value.id) }
      ),
      Field(
        "corrected",
        BooleanType,
        resolve = implicit context => withUser { user => context.ctx.tableDefs.futureUserHasCorrection(context.value.id, user.username) }
      ),
      Field(
        "allUsersWithCorrection",
        ListType(StringType),
        resolve = implicit context => withAdminUser { _ => context.ctx.tableDefs.futureUsersWithCorrection(context.value.id) }
      ),
      Field("flatUserSolution", OptionType(ListType(flatSolutionGraphQLType)), arguments = usernameArg :: Nil, resolve = resolveFlatUserSolution),
      Field(
        "solutionForUserAsJson",
        OptionType(StringType),
        arguments = usernameArg :: Nil,
        deprecationReason = Some("Will be removed!"),
        resolve = resolveSolutionForUserAsJson
      ),
      Field(
        "correctionForUserAsJson",
        OptionType(StringType),
        arguments = usernameArg :: Nil,
        deprecationReason = Some("Will be removed!"),
        resolve = resolveCorrectionForUserAsJson
      ),
      Field("flatCorrectionForUser", flatCorrectionGraphQLType, arguments = usernameArg :: Nil, resolve = resolveFlatCorrectionForUser)
    )
  )

}
