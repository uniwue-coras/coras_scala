package model.graphql

import model.Exercise
import sangria.schema.{Field, ListType, ObjectType, fields}

import scala.concurrent.Future

trait RootQuery extends GraphQLArguments with ExerciseQuery with GraphQLBasics {

  private val resolveAllExercises: Resolver[Unit, Seq[Exercise]] = implicit context => withUser { _ => context.ctx.tableDefs.futureAllExercises }

  private val resolveExercise: Resolver[Unit, Exercise] = implicit context =>
    withUser { _ =>
      for {
        maybeExercise: Option[Exercise] <- context.ctx.tableDefs.futureMaybeExerciseById(context.arg(exerciseIdArg))

        result <- maybeExercise match {
          case None           => Future.failed(UserFacingGraphQLError("No such exercise!"))
          case Some(exercise) => Future.successful(exercise)
        }
      } yield result
    }

  protected val queryType: ObjectType[GraphQLContext, Unit] = ObjectType(
    "Query",
    fields[GraphQLContext, Unit](
      Field("exercises", ListType(exerciseQueryType), resolve = resolveAllExercises),
      Field("exercise", exerciseQueryType, arguments = exerciseIdArg :: Nil, resolve = resolveExercise)
    )
  )

}
