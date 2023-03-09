package model.graphql

import model.{AnnotationInput, Applicability, FlatSolutionNodeInput}
import sangria.macros.derive.deriveInputObjectType
import sangria.schema.{EnumType, InputObjectType}

trait GraphQLInputObjectTypes {

  protected val annotationInputType: InputObjectType[AnnotationInput] = deriveInputObjectType()

  private val flatSolutionNodeInputType: InputObjectType[FlatSolutionNodeInput] = {
    // noinspection ScalaUnusedSymbol
    implicit val x0: EnumType[Applicability] = Applicability.graphQLType

    deriveInputObjectType()
  }

  protected val graphQLUserSolutionInputType: InputObjectType[GraphQLUserSolutionInput] = {
    // noinspection ScalaUnusedSymbol
    implicit val x0: InputObjectType[FlatSolutionNodeInput] = flatSolutionNodeInputType

    deriveInputObjectType[GraphQLUserSolutionInput]()
  }

  protected val graphQLExerciseInputType: InputObjectType[GraphQLExerciseInput] = {
    // noinspection ScalaUnusedSymbol
    implicit val x0: InputObjectType[FlatSolutionNodeInput] = flatSolutionNodeInputType

    deriveInputObjectType[GraphQLExerciseInput]()
  }

}
