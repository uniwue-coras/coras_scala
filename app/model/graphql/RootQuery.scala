package model.graphql

import model.Exercise
import sangria.schema.{Field, ListType, ObjectType, fields}

trait RootQuery extends GraphQLArguments with ExerciseQuery with GraphQLBasics {

  private val resolveAllExercises: Resolver[Unit, Seq[Exercise]] = resolveWithUser { (context, _) => context.ctx.tableDefs.futureAllExercises }

  private val resolveExercise: Resolver[Unit, Exercise] = resolveWithUser { (context, _) =>
    for {
      maybeExercise <- context.ctx.tableDefs.futureMaybeExerciseById(context.arg(exerciseIdArg))
      result        <- futureFromOption(maybeExercise, UserFacingGraphQLError("No such exercise!"))
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
