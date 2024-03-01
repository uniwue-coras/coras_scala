package model

import sangria.schema.{InputField, InputObjectType, ListInputType, StringType}

final case class UserSolutionInput(
  username: String,
  solution: Seq[SolutionNodeInput]
)

object UserSolutionInput:
  val inputType = InputObjectType[UserSolutionInput](
    "UserSolutionInput",
    List(
      InputField("username", StringType),
      InputField("solution", ListInputType(SolutionNodeInput.inputType))
    )
  )
