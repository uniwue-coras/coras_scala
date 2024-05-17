package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import model.userSolution.{UserSolution, UserSolutionInput, UserSolutionKey, UserSolutionQueries}
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

  val queryType = ObjectType[GraphQLContext, Exercise](
    "Exercise",
    fields[GraphQLContext, Exercise](
      Field("id", IntType, resolve = _.value.id),
      Field("title", StringType, resolve = _.value.title),
      Field("text", StringType, resolve = _.value.text),
      Field("sampleSolution", ListType(SampleSolutionNode.queryType), resolve = resolveSampleSolution),
      Field("userSolutions", ListType(UserSolutionQueries.queryType), resolve = resolveAllUserSolutions),
      Field("userSolution", OptionType(UserSolutionQueries.queryType), arguments = usernameArg :: Nil, resolve = resolveUserSolution)
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
          for {
            matches <- UserSolution.correct(ws, tableDefs, exercise.id, username)
            _       <- tableDefs.futureInsertUserSolutionForExercise(username, exercise.id, flatSolution, matches)
          } yield Some(UserSolution(username, exercise.id))
      }
    } yield newSolution
  }

  val mutationType: ObjectType[GraphQLContext, Exercise] = ObjectType(
    "ExerciseMutations",
    fields[GraphQLContext, Exercise](
      Field("submitSolution", OptionType(UserSolutionQueries.queryType), arguments = userSolutionInputArg :: Nil, resolve = resolveSubmitSolution),
      Field("userSolution", OptionType(UserSolutionQueries.mutationType), arguments = usernameArg :: Nil, resolve = resolveUserSolution)
    )
  )
}
