package model

import model.graphql.{GraphQLArguments, GraphQLContext}
import sangria.schema.{BooleanType, Field, ObjectType, fields}

class UserSolution {}

object UserSolution extends GraphQLArguments {

  val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutations",
    fields[GraphQLContext, UserSolution](
      Field("submitCorrection", BooleanType, arguments = entryCorrectionsArg :: Nil, resolve = _ => ???)
    )
  )

}
