package model.graphql

import model._
import model.matching.{CertainNodeMatch, FuzzyNodeMatch, NodeMatchingResult, TreeMatcher}
import play.api.libs.json.Json
import sangria.macros.derive.{AddFields, deriveObjectType}
import sangria.schema.{BooleanType, EnumType, Field, ListType, ObjectType, OptionType, StringType}

import scala.concurrent.ExecutionContext

trait ExerciseQuery extends GraphQLArguments with GraphQLBasics {

  protected implicit val ec: ExecutionContext

  // types

  private val solutionNodeSubTextGraphQLType: ObjectType[Unit, SolutionNodeSubText] = {
    implicit val x0: EnumType[Applicability] = Applicability.graphQLType

    deriveObjectType()
  }

  private val flatSolutionGraphQLType: ObjectType[Unit, FlatSolutionNode] = {
    implicit val x0: EnumType[Applicability]               = Applicability.graphQLType
    implicit val x1: ObjectType[Unit, SolutionNodeSubText] = solutionNodeSubTextGraphQLType

    deriveObjectType()
  }

  private val flatSolutionNodeMatchGraphQLType: ObjectType[Unit, FlatSolutionNodeMatch] = deriveObjectType()

  private val flatCorrectionGraphQLType: ObjectType[Unit, FlatCorrection] = {
    implicit val x0: ObjectType[Unit, FlatSolutionNode]      = flatSolutionGraphQLType
    implicit val x1: ObjectType[Unit, FlatSolutionNodeMatch] = flatSolutionNodeMatchGraphQLType

    deriveObjectType()
  }

  // resolvers

  private val resolveFlatSampleSolution: Resolver[Exercise, Seq[FlatSolutionNode]] = resolveWithUser { (context, _) =>
    context.ctx.tableDefs.futureSampleSolutionForExercise(context.value.id)
  }

  private val resolveFlatUserSolution: Resolver[Exercise, Seq[FlatSolutionNode]] = resolveWithCorrector { (context, _) =>
    context.ctx.tableDefs.futureUserSolutionForExercise(context.arg(usernameArg), context.value.id)
  }

  private val resolveSolutionSubmitted: Resolver[Exercise, Boolean] = resolveWithUser { (context, user) =>
    context.ctx.tableDefs.futureUserHasSubmittedSolution(context.value.id, user.username)
  }

  private val resolveAllUsersWithSolution: Resolver[Exercise, Seq[String]] = resolveWithAdmin { (context, _) =>
    context.ctx.tableDefs.futureUsersWithSolution(context.value.id)
  }

  private val resolveCorrected: Resolver[Exercise, Boolean] = resolveWithUser { (context, user) =>
    context.ctx.tableDefs.futureUserHasCorrection(context.value.id, user.username)
  }

  private val resolveAllUsersWithCorrection: Resolver[Exercise, Seq[String]] = resolveWithAdmin { (context, _) =>
    context.ctx.tableDefs.futureUsersWithCorrection(context.value.id)
  }

  @deprecated()
  private val resolveCorrectionForUserAsJson: Resolver[Exercise, Option[String]] = resolveWithCorrector { (context, _) =>
    for {
      maybeMongoCorrection <- context.ctx.tableDefs.futureCorrectionForExerciseAndUser(context.value.id, context.arg(usernameArg))

      maybeCorrection = maybeMongoCorrection.map { correction =>
        Json.stringify(Json.toJson(correction)(Correction.correctionJsonFormat))
      }
    } yield maybeCorrection
  }

  private val resolveFlatCorrectionForUser: Resolver[Exercise, FlatCorrection] = resolveWithCorrector { (context, _) =>
    for {
      sampleSolution <- context.ctx.tableDefs.futureSampleSolutionForExercise(context.value.id)
      userSolution   <- context.ctx.tableDefs.futureUserSolutionForExercise(context.arg(usernameArg), context.value.id)

      NodeMatchingResult(matches, _ /*notMatchedSample*/, _ /*notMatchedUser*/ ) = TreeMatcher.performMatching(sampleSolution, userSolution)

      matchingResult: Seq[FlatSolutionNodeMatch] = matches.map {
        case CertainNodeMatch(sampleValue, userValue)          => FlatSolutionNodeMatch(sampleValue, userValue)
        case FuzzyNodeMatch(sampleValue, userValue, certainty) => FlatSolutionNodeMatch(sampleValue, userValue)
      }

      result = FlatCorrection(sampleSolution, userSolution, matchingResult)
    } yield result
  }

  // query type

  val exerciseQueryType: ObjectType[GraphQLContext, Exercise] = deriveObjectType(
    AddFields[GraphQLContext, Exercise](
      Field("flatSampleSolution", ListType(flatSolutionGraphQLType), resolve = resolveFlatSampleSolution),
      // User solutions
      Field("flatUserSolution", ListType(flatSolutionGraphQLType), arguments = usernameArg :: Nil, resolve = resolveFlatUserSolution),
      Field("solutionSubmitted", BooleanType, resolve = resolveSolutionSubmitted),
      Field("allUsersWithSolution", ListType(StringType), resolve = resolveAllUsersWithSolution),
      // Corrections
      Field("corrected", BooleanType, resolve = resolveCorrected),
      Field("allUsersWithCorrection", ListType(StringType), resolve = resolveAllUsersWithCorrection),
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