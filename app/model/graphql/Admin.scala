package model.graphql

import model.Rights
import sangria.schema._

class Admin {}

object Admin extends GraphQLArguments {

  def usersWithRights(rights: Rights): Seq[String] = Seq(???)

  def usersByPrefix(prefix: String): Seq[String] = Seq(???)

  val queryType: ObjectType[GraphQLContext, Admin] = ObjectType(
    "AdminQueries",
    fields[GraphQLContext, Admin](
      Field("usersWithRights", ListType(StringType), arguments = rightsArg :: Nil, resolve = _ => ???),
      Field("usersByPrefix", ListType(StringType), arguments = prefixArg :: Nil, resolve = _ => ???)
    )
  )

  val mutationType: ObjectType[GraphQLContext, Admin] = ObjectType(
    "AdminMutations",
    fields[GraphQLContext, Admin](
      Field("changeUserRights", Rights.graphQLType, arguments = usernameArg :: rightsArg :: Nil, resolve = _ => ???),
      Field("addExercise", IntType, arguments = exerciseInputArg :: Nil, resolve = _ => ???)
    )
  )

}
