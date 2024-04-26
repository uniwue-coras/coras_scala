package model

import sangria.schema.{InputField, InputObjectType, ListInputType, StringType}

final case class ExerciseInput(
  title: String,
  sampleSolution: Seq[SolutionNodeInput]
)

object ExerciseInput {
  val inputType: InputObjectType[ExerciseInput] = InputObjectType[ExerciseInput](
    "ExerciseInput",
    List(
      InputField("title", StringType),
      InputField("sampleSolution", ListInputType(SolutionNodeInput.inputType))
    )
  )
}
