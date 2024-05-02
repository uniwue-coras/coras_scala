package model

import sangria.schema.{InputField, InputObjectType, ListInputType, StringType}

final case class ExerciseInput(
  title: String,
  text: String,
  sampleSolution: Seq[SolutionNodeInput]
)

object ExerciseInput {
  val inputType: InputObjectType[ExerciseInput] = InputObjectType[ExerciseInput](
    "ExerciseInput",
    List(
      InputField("title", StringType),
      InputField("text", StringType),
      InputField("sampleSolution", ListInputType(SolutionNodeInput.inputType))
    )
  )
}
