package model.graphql

import model.{ExerciseInput, Rights}
import sangria.schema._

class Admin {}

object Admin extends GraphQLArguments {

  val queryType: ObjectType[GraphQLContext, Admin] = ObjectType(
    "AdminQueries",
    fields[GraphQLContext, Admin](
      Field(
        "usersWithRights",
        ListType(StringType),
        arguments = rightsArg :: Nil,
        resolve = context => context.ctx.tableDefs.futureUsersWithRights(context.arg(rightsArg))
      ),
      Field(
        "usersByPrefix",
        ListType(StringType),
        arguments = prefixArg :: Nil,
        resolve = context => context.ctx.tableDefs.futureUsersByUsernamePrefix(context.arg(prefixArg))
      )
    )
  )

  val mutationType: ObjectType[GraphQLContext, Admin] = ObjectType(
    "AdminMutations",
    fields[GraphQLContext, Admin](
      Field(
        "changeUserRights",
        Rights.graphQLType,
        arguments = usernameArg :: rightsArg :: Nil,
        resolve = context => {
          // TODO: refactor somehow...
          val newRights = context.arg(rightsArg)

          context.ctx.tableDefs.futureUpdateUserRights(context.arg(usernameArg), newRights)

          newRights
        }
      ),
      /*
      Field(
        "addExercise",
        IntType,
        arguments = exerciseInputArg :: Nil,
        resolve = context =>
          context.arg(exerciseInputArg) match {
            case ExerciseInput(title, text, sampleSolution) => context.ctx.tableDefs.futureInsertCompleteExercise(title, text, sampleSolution)
          }
      )
       */
    )
  )

}
