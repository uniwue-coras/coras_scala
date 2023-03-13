package model.graphql

import model.{Annotation, AnnotationGraphQLTypes, AnnotationInput, FlatUserSolutionNode}
import sangria.schema._

trait UserSolutionNodeMutations extends GraphQLArguments with GraphQLBasics with AnnotationGraphQLTypes {

  private val resolveSubmitAnnotation: Resolver[FlatUserSolutionNode, Annotation] = context => {
    val annotationInput: AnnotationInput = context.arg(annotationArgument)

    ???
  }

  protected val userSolutionNodeMutationType: ObjectType[GraphQLContext, FlatUserSolutionNode] = ObjectType(
    "UserSolutionNode",
    fields[GraphQLContext, FlatUserSolutionNode](
      Field("submitAnnotation", annotationGraphQLType, arguments = annotationArgument :: Nil, resolve = resolveSubmitAnnotation)
    )
  )

}
