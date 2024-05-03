package model

import sangria.schema.{InputObjectType, InputField, StringType, OptionInputType}

final case class ParagraphCitationAnnotationInput(
  awaitedParagraph: String,
  correctness: Correctness,
  citedParagraph: Option[String],
  explanation: Option[String] = None
)

object ParagraphCitationAnnotationInput {
  val inputType = InputObjectType[ParagraphCitationAnnotationInput](
    "ParagraphCitationAnnotationInput",
    List(
      InputField("awaitedParagraph", StringType),
      InputField("correctness", Correctness.graphQLType),
      InputField("citedParagraph", OptionInputType(StringType)),
      InputField("explanation", OptionInputType(StringType))
    )
  )
}
