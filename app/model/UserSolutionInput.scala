package model

import sangria.schema.{ListInputType, StringType, InputObjectType, InputField}

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
