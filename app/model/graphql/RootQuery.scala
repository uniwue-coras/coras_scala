package model.graphql

import model.Exercise
import model.graphql.GraphQLArguments.exerciseIdArg
import sangria.schema.{Field, ListType, ObjectType, fields}

import scala.concurrent.ExecutionContext

trait RootQuery extends GraphQLBasics {

  protected implicit val ec: ExecutionContext

  private val resolveAllExercises: Resolver[Unit, Seq[Exercise]] = resolveWithUser { (context, _) => context.ctx.tableDefs.futureAllExercises }

  private val resolveExercise: Resolver[Unit, Exercise] = resolveWithUser { (context, _) =>
    for {
      exerciseId    <- futureFromOption(context.argOpt(exerciseIdArg), UserFacingGraphQLError("Missing argument!"))
      maybeExercise <- context.ctx.tableDefs.futureMaybeExerciseById(exerciseId)
      result        <- futureFromOption(maybeExercise, UserFacingGraphQLError("No such exercise!"))
    } yield result
  }

  protected val queryType: ObjectType[GraphQLContext, Unit] = ObjectType(
    "Query",
    fields[GraphQLContext, Unit](
      Field("exercises", ListType(ExerciseGraphQLTypes.exerciseQueryType), resolve = resolveAllExercises),
      Field("exercise", ExerciseGraphQLTypes.exerciseQueryType, arguments = exerciseIdArg :: Nil, resolve = resolveExercise)
    )
  )

}
