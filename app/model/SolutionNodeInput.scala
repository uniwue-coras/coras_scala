package model

import sangria.schema._

final case class SolutionNodeInput(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  isProblemFocus: Boolean,
  parentId: Option[Int]
) extends SolutionNode

object SolutionNodeInput {
  val inputType: InputObjectType[SolutionNodeInput] = InputObjectType[SolutionNodeInput](
    "FlatSolutionNodeInput",
    List(
      InputField("id", IntType),
      InputField("childIndex", IntType),
      InputField("isSubText", BooleanType),
      InputField("text", StringType),
      InputField("applicability", Applicability.graphQLType),
      InputField("parentId", OptionInputType(IntType))
    )
  )
}
