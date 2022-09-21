package model.graphql

import model._
import model.matching.{CertainNodeMatch, FuzzyNodeMatch, NodeMatchingResult, TreeMatcher}
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{AddFields, deriveObjectType}
import sangria.schema.{BooleanType, EnumType, Field, ListType, ObjectType, OptionType, StringType}

import scala.concurrent.{ExecutionContext, Future}

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

  private val resolveFlatUserSolution: Resolver[Exercise, Option[Seq[FlatSolutionNode]]] = resolveWithCorrector { (context, _) =>
    for {
      maybeUserSolution <- context.ctx.tableDefs.futureUserSolutionForExercise(context.value.id, context.arg(usernameArg))

      maybeSolution = maybeUserSolution.map { ms => SolutionTree.flattenTree(ms.solution) }
    } yield maybeSolution
  }

  @deprecated()
  private val resolveSolutionForUserAsJson: Resolver[Exercise, Option[String]] = resolveWithCorrector { (context, _) =>
    for {
      maybeUserSolution <- context.ctx.tableDefs.futureUserSolutionForExercise(context.value.id, context.arg(usernameArg))

      maybeSolution = maybeUserSolution.map { mongoSolution =>
        implicit val x0: OFormat[SolutionNode] = SolutionNode.solutionNodeJsonFormat

        Json.stringify(Json.toJson(mongoSolution.solution))
      }
    } yield maybeSolution
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
    val username = context.arg(usernameArg)

    for {
      maybeSol <- context.ctx.tableDefs.futureUserSolutionForExercise(context.value.id, username)

      sampleSolution <- context.ctx.tableDefs.futureSampleSolutionForExercise(context.value.id)

      completeUserSolution <- maybeSol match {
        case None                    => Future.failed(UserFacingGraphQLError(s"No solution for user $username"))
        case Some(mongoUserSolution) => Future.successful(mongoUserSolution)
      }

      // sampleSolution: Seq[FlatSolutionNode] = SolutionTree.flattenTree(context.value.sampleSolution)
      userSolution = SolutionTree.flattenTree(completeUserSolution.solution)

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
      Field(
        "flatSampleSolution",
        ListType(flatSolutionGraphQLType),
        resolve = resolveWithUser { (context, _) => context.ctx.tableDefs.futureSampleSolutionForExercise(context.value.id) }
      ),
      Field(
        "solutionSubmitted",
        BooleanType,
        resolve = resolveWithUser { (context, user) => context.ctx.tableDefs.futureUserHasSubmittedSolution(context.value.id, user.username) }
      ),
      Field(
        "allUsersWithSolution",
        ListType(StringType),
        resolve = resolveWithAdmin { (context, _) => context.ctx.tableDefs.futureUsersWithSolution(context.value.id) }
      ),
      Field(
        "corrected",
        BooleanType,
        resolve = resolveWithUser { (context, user) => context.ctx.tableDefs.futureUserHasCorrection(context.value.id, user.username) }
      ),
      Field(
        "allUsersWithCorrection",
        ListType(StringType),
        resolve = resolveWithAdmin { (context, _) => context.ctx.tableDefs.futureUsersWithCorrection(context.value.id) }
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
