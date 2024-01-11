package model

import sangria.schema.{InputField, InputObjectType, ListInputType, StringType}

final case class UserSolutionInput(
  username: String,
  solution: Seq[FlatSolutionNodeInput]
)

object UserSolutionInput:
  val inputType: InputObjectType[UserSolutionInput] = InputObjectType[UserSolutionInput](
    "UserSolutionInput",
    List(
      InputField("username", StringType),
      InputField("solution", ListInputType(FlatSolutionNodeInputGraphQLTypes.inputType))
    )
  )
