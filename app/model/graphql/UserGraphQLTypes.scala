package model.graphql

import model.{Rights, User}
import sangria.schema.{Field, ObjectType, StringType, fields}

object UserGraphQLTypes {

  val queryType: ObjectType[GraphQLContext, User] = ObjectType(
    "User",
    fields[GraphQLContext, User](
      Field("username", StringType, resolve = _.value.username),
      Field("rights", Rights.graphQLType, resolve = _.value.rights)
    )
  )

}
