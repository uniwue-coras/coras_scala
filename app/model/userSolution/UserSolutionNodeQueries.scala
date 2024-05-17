package model.userSolution

import model._
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema._

object UserSolutionNodeQueries extends GraphQLBasics {

  private val resolveMatch: Resolver[UserSolutionNode, Option[SolutionNodeMatch]] = unpackedResolverWithArgs {
    case (_, tableDefs, _, UserSolutionNode(username, exerciseId, userNodeId, _, _, _, _, _, _), args) =>
      val sampleNodeId = args.arg(sampleSolutionNodeIdArgument)
      tableDefs.futureSelectMatch(SolutionNodeMatchKey(exerciseId, username, sampleNodeId, userNodeId))
  }

  private val resolveAnnotations: Resolver[UserSolutionNode, Seq[Annotation]] = unpackedResolver { case (_, tableDefs, _, userSolNode) =>
    tableDefs.futureAnnotationsForUserSolutionNode(userSolNode.dbKey)
  }

  val queryType: ObjectType[GraphQLContext, UserSolutionNode] = ObjectType[GraphQLContext, UserSolutionNode](
    "FlatUserSolutionNode",
    interfaces[GraphQLContext, UserSolutionNode](SolutionNode.interfaceType),
    fields[GraphQLContext, UserSolutionNode](
      Field("match", OptionType(SolutionNodeMatch.queryType), arguments = sampleSolutionNodeIdArgument :: Nil, resolve = resolveMatch),
      Field("annotations", ListType(Annotation.queryType), resolve = resolveAnnotations)
    )
  )
}
