package model.graphql

import model._
import model.matching.WordMatcher.WordMatchingResult
import model.matching._
import sangria.macros.derive.{AddFields, ExcludeFields, ObjectTypeName, deriveObjectType}
import sangria.schema.{BooleanType, EnumType, Field, ListType, ObjectType, StringType}

import scala.concurrent.ExecutionContext

trait ExerciseQuery extends GraphQLArguments with GraphQLBasics {

  protected implicit val ec: ExecutionContext

  // types

  private val solutionNodeSubTextGraphQLType: ObjectType[Unit, SolutionNodeSubText] = deriveObjectType()

  private val resolveSubTexts: Resolver[FlatSolutionNode, Seq[SolutionNodeSubText]] = { context =>
    val FlatSolutionNode(maybeUsername, exerciseId, id, _, _, _, _) = context.value

    maybeUsername match {
      case Some(username) => context.ctx.tableDefs.futureSubTextsForUserSolutionNode(username, exerciseId, id)
      case None           => context.ctx.tableDefs.futureSubTextsForSampleSolutionNode(exerciseId, id)
    }
  }

  private val flatSolutionGraphQLType: ObjectType[GraphQLContext, FlatSolutionNode] = {
    implicit val x0: EnumType[Applicability] = Applicability.graphQLType

    deriveObjectType(
      ExcludeFields("maybeUsername", "exerciseId"),
      AddFields(
        Field("subTexts", ListType(solutionNodeSubTextGraphQLType), resolve = resolveSubTexts)
      )
    )
  }

  private val fuzzyMatchExplanationType: ObjectType[Unit, FuzzyWordMatchExplanation] = deriveObjectType()

  private val extractedNounType: ObjectType[Unit, ExtractedWord] = deriveObjectType()

  private val extractedNounMatchType: ObjectType[Unit, Match[ExtractedWord, FuzzyWordMatchExplanation]] = {
    implicit val x0: ObjectType[Unit, ExtractedWord]             = extractedNounType
    implicit val x1: ObjectType[Unit, FuzzyWordMatchExplanation] = fuzzyMatchExplanationType

    deriveObjectType(
      ExcludeFields("explanation")
    )
  }

  private val nounMatchingResultGraphQLType: ObjectType[Unit, WordMatchingResult] = {
    implicit val x0: ObjectType[Unit, FuzzyWordMatchExplanation]                       = fuzzyMatchExplanationType
    implicit val x1: ObjectType[Unit, Match[ExtractedWord, FuzzyWordMatchExplanation]] = extractedNounMatchType
    implicit val x2: ObjectType[Unit, ExtractedWord]                                   = extractedNounType

    deriveObjectType(
      ObjectTypeName("NounMatchingResult")
    )
  }

  private val nodeMatchGraphQLType: ObjectType[Unit, NodeIdMatch] = {
    implicit val x0: ObjectType[Unit, WordMatchingResult] = nounMatchingResultGraphQLType

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

  private val resolveFlatCorrectionForUser: Resolver[Exercise, Seq[NodeIdMatch]] = resolveWithCorrector { (context, _) =>
    // FIXME: broken => GC mania!
    for {
      sampleSolution <- context.ctx.tableDefs.futureSampleSolutionForExercise(context.value.id)
      userSolution   <- context.ctx.tableDefs.futureUserSolutionForExercise(context.arg(usernameArg), context.value.id)
    } yield TreeMatcher.performMatching(sampleSolution, userSolution)
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
      Field("flatCorrectionForUser", ListType(nodeMatchGraphQLType), arguments = usernameArg :: Nil, resolve = resolveFlatCorrectionForUser)
    )
  )
}
