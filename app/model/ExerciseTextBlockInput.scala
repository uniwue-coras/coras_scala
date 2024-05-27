package model

import sangria.macros.derive.deriveInputObjectType

final case class ExerciseTextBlockInput(
  startText: String,
  ends: Seq[String]
)

object ExerciseTextBlockInput {
  val inputType = deriveInputObjectType[ExerciseTextBlockInput]()
}
