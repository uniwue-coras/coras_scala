package model

import sangria.schema._

final case class FlatSolutionNodeInput(
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
)

object FlatSolutionNodeInputGraphQLTypes:
  val inputType: InputObjectType[FlatSolutionNodeInput] = InputObjectType[FlatSolutionNodeInput](
    "FlatSolutionNodeInput",
    List(
      InputField("id", IntType),
      InputField("childIndex", IntType),
      InputField("text", StringType),
      InputField("applicability", Applicability.graphQLType),
      InputField("parentId", OptionInputType(IntType))
    )
  )
