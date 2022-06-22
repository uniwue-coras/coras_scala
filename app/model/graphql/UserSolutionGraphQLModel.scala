package model.graphql

import model.UserSolution
import sangria.schema._

object UserSolutionGraphQLModel {

  val mutationType: ObjectType[GraphQLContext, UserSolution] = ObjectType(
    "UserSolutionMutation",
    fields[GraphQLContext, UserSolution](
      Field("_x", BooleanType, resolve = _ => false)
    )
  )

}
