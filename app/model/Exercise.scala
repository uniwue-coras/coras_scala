package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import model.userSolution.{UserSolution, UserSolutionInput, UserSolutionKey, UserSolutionNode, UserSolutionQueries}
import sangria.schema._

import scala.concurrent.Future

final case class Exercise(
  id: Int,
  title: String,
  text: String
)

object Exercise extends GraphQLBasics {

  private val resolveSampleSolution: Resolver[Exercise, Seq[SampleSolutionNode]] = unpackedResolverWithUser { case (_, tableDefs, _, exercise, _, _) =>
    tableDefs.futureAllSampleSolNodesForExercise(exercise.id)
  }

  private val resolveAllUserSolutions: Resolver[Exercise, Seq[UserSolution]] = unpackedResolverWithCorrector { case (_, tableDefs, _, exercise, _, _) =>
    tableDefs.futureUserSolutionsForExercise(exercise.id)
  }

  private val resolveUserSolution: Resolver[Exercise, Option[UserSolution]] = unpackedResolverWithCorrector { case (_, tableDefs, _, exercise, _, args) =>
    tableDefs.futureMaybeUserSolution(UserSolutionKey(exercise.id, args.arg(usernameArg)))
  }

  private val resolveTextBlocks: Resolver[Exercise, Seq[ExerciseTextBlock]] = unpackedResolverWithCorrector { case (_, tableDefs, _, exercise, _, _) =>
    tableDefs.futureSelectExerciseTextBlocksForExercise(exercise.id)
  }

  val queryType = ObjectType[GraphQLContext, Exercise](
    "Exercise",
    fields[GraphQLContext, Exercise](
      Field("id", IntType, resolve = _.value.id),
      Field("title", StringType, resolve = _.value.title),
      Field("text", StringType, resolve = _.value.text),
      Field("sampleSolution", ListType(SampleSolutionNode.queryType), resolve = resolveSampleSolution),
      Field("userSolutions", ListType(UserSolutionQueries.queryType), resolve = resolveAllUserSolutions),
      Field("userSolution", OptionType(UserSolutionQueries.queryType), arguments = usernameArg :: Nil, resolve = resolveUserSolution),
      Field("textBlocks", ListType(ExerciseTextBlock.queryType), resolve = resolveTextBlocks)
    )
  )

  private val resolveSubmitSolution: Resolver[Exercise, Option[UserSolution]] = unpackedResolverWithUser { case (ws, tableDefs, _ec, exercise, _, args) =>
    implicit val ec = _ec

    val UserSolutionInput(username, flatSolution) = args.arg(userSolutionInputArg)

    for {
      maybeExistingSolution <- tableDefs.futureMaybeUserSolution(UserSolutionKey(exercise.id, username))

      newSolution <- maybeExistingSolution match {
        case Some(_) => Future.successful(None)
        case None =>
          val userSolutionNodes = flatSolution.map { UserSolutionNode.fromInput(username, exercise.id) }

          for {
            matches <- UserSolution.correct(userSolutionNodes, ws, tableDefs, exercise.id, username)
            _       <- tableDefs.futureInsertUserSolutionForExercise(username, exercise.id, userSolutionNodes, matches)
          } yield Some(UserSolution(username, exercise.id))
      }
    } yield newSolution
  }

  private val resolveSubmitTextBlock: Resolver[Exercise, ExerciseTextBlock] = unpackedResolverWithAdmin { case (_, tableDefs, _ec, exercise, _, args) =>
    implicit val ec                             = _ec
    val ExerciseTextBlockInput(startText, ends) = args.arg(exerciseTextBlockInputArg)

    println(startText + " :: " + ends)

    for {
      id <- tableDefs.futureInsertTextBlock(exercise.id, startText, ends)
    } yield ExerciseTextBlock(exercise.id, id, startText /*, contents*/ )
  }

  private val resolveTextBlock: Resolver[Exercise, Option[ExerciseTextBlock]] = unpackedResolverWithAdmin { case (_, tableDefs, _ec, exercise, _, args) =>
    tableDefs.futureSelectExerciseTextBlock(exercise.id, args.arg(blockIdArg))
  }

  val mutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolution", OptionType(UserSolutionQueries.queryType), arguments = userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("userSolution", OptionType(UserSolutionQueries.mutationType), arguments = usernameArg :: Nil, resolve = resolveUserSolution),
      Field("submitTextBlock", ExerciseTextBlock.queryType, arguments = exerciseTextBlockInputArg :: Nil, resolve = resolveSubmitTextBlock),
      Field("textBlock", OptionType(ExerciseTextBlock.mutationType), arguments = blockIdArg :: Nil, resolve = resolveTextBlock)
    )
  )
}
