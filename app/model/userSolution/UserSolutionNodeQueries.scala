package model.userSolution

import model._
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{Field, ListType, ObjectType, fields, interfaces}

object UserSolutionNodeQueries extends GraphQLBasics {

  private val resolveAnnotations: Resolver[UserSolutionNode, Seq[Annotation]] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, _), UserSolutionNode(username, exerciseId, id, _, _, _, _, _)) =>
      tableDefs.futureAnnotationsForUserSolutionNode(username, exerciseId, id)
  }

  val queryType: ObjectType[GraphQLContext, UserSolutionNode] = ObjectType[GraphQLContext, UserSolutionNode](
    "FlatUserSolutionNode",
    interfaces[GraphQLContext, UserSolutionNode](SolutionNode.interfaceType),
    fields[GraphQLContext, UserSolutionNode](
      Field("annotations", ListType(Annotation.queryType), resolve = resolveAnnotations)
    )
  )
}
