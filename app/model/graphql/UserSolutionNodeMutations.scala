package model.graphql

import model.{Annotation, FlatSolutionNode}
import sangria.macros.derive.deriveObjectType
import sangria.schema._

trait UserSolutionNodeMutations extends GraphQLArguments with GraphQLBasics {

  private val annotationType: ObjectType[Unit, Annotation] = deriveObjectType()

  private val resolveSubmitAnnotation: Resolver[FlatSolutionNode, Annotation] = context => {
    val annotation = context.arg(annotationArgument)

    ???
  }

  protected val userSolutionNodeMutationType: ObjectType[GraphQLContext, FlatSolutionNode] = ObjectType(
    "UserSolutionNode",
    fields[GraphQLContext, FlatSolutionNode](
      Field("submitAnnotation", annotationType, arguments = annotationArgument :: Nil, resolve = resolveSubmitAnnotation)
    )
  )

}
