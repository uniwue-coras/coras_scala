package model

import model.graphql.MyInputType
import sangria.schema._

final case class FlatSolutionNodeInput(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
)

object FlatSolutionNodeInputGraphQLTypes extends MyInputType[FlatSolutionNodeInput]:
  override val inputType: InputObjectType[FlatSolutionNodeInput] = InputObjectType[FlatSolutionNodeInput](
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
