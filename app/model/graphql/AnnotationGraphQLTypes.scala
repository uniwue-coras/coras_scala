package model.graphql

import model.{Annotation, AnnotationInput, ErrorType}
import sangria.macros.derive.{ExcludeFields, deriveInputObjectType, deriveObjectType}
import sangria.schema.{EnumType, InputObjectType, ObjectType}

object AnnotationGraphQLTypes {

  // noinspection ScalaUnusedSymbol
  private implicit val x0: EnumType[ErrorType] = ErrorType.graphQLEnumType

  // Input type
  val annotationInputType: InputObjectType[AnnotationInput] = deriveInputObjectType()

  // Query type
  val annotationQueryType: ObjectType[Unit, Annotation] = deriveObjectType(
    ExcludeFields("username", "exerciseId", "nodeId")
  )

}
