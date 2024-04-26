package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{Field, ObjectType, StringType, fields}

final case class User(
  username: String,
  maybePasswordHash: Option[String] = None,
  rights: Rights = Rights.Student
)

object UserGraphQLTypes extends GraphQLBasics {
  val queryType: ObjectType[GraphQLContext, User] = ObjectType(
    "User",
    fields[GraphQLContext, User](
      Field("username", StringType, resolve = _.value.username),
      Field("rights", Rights.graphQLType, resolve = _.value.rights)
    )
  )
}
