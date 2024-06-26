package model

import sangria.schema.{InputField, InputObjectType, IntType, StringType}

final case class AnnotationInput(
  errorType: ErrorType,
  importance: Importance,
  startIndex: Int,
  endIndex: Int,
  text: String
)

object AnnotationInput {
  val inputType = InputObjectType[AnnotationInput](
    "AnnotationInput",
    List(
      InputField("errorType", ErrorType.graphQLType),
      InputField("importance", Importance.graphQLType),
      InputField("startIndex", IntType),
      InputField("endIndex", IntType),
      InputField("text", StringType)
    )
  )
}
