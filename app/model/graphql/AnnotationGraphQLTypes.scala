package model.graphql

import model.{Annotation, AnnotationImportance, AnnotationInput, ErrorType}
import sangria.macros.derive.{ExcludeFields, deriveInputObjectType, deriveObjectType}
import sangria.schema.{EnumType, InputObjectType, ObjectType}

import scala.annotation.unused

object AnnotationGraphQLTypes {

  @unused private implicit val errorTypeType: EnumType[ErrorType] = ErrorType.graphQLEnumType

  @unused private implicit val annotationImportanceType: EnumType[AnnotationImportance] = AnnotationImportance.graphQLType

  // Input type
  val annotationInputType: InputObjectType[AnnotationInput] = deriveInputObjectType()

  // Query type
  val annotationQueryType: ObjectType[Unit, Annotation] = deriveObjectType(
    ExcludeFields("username", "exerciseId", "nodeId")
  )

}
