package model

import model.graphql.{GraphQLContext, MyQueryType}
import sangria.schema.{Field, ObjectType, StringType, fields}

final case class User(
  username: String,
  maybePasswordHash: Option[String] = None,
  rights: Rights = Rights.Student
)

object UserGraphQLTypes extends MyQueryType[User]:
  override val queryType: ObjectType[GraphQLContext, User] = ObjectType(
    "User",
    fields[GraphQLContext, User](
      Field("username", StringType, resolve = _.value.username),
      Field("rights", Rights.graphQLType, resolve = _.value.rights)
    )
  )
