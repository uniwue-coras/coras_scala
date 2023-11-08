package model

import model.graphql.MyInputType
import sangria.macros.derive.deriveInputObjectType
import sangria.schema.{EnumType, InputObjectType}

import scala.annotation.unused

final case class FlatSolutionNodeInput(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
)

object FlatSolutionNodeInputGraphQLTypes extends MyInputType[FlatSolutionNodeInput] {

  @unused private implicit val applicabilityGraphQLType: EnumType[Applicability] = Applicability.graphQLType

  override val inputType: InputObjectType[FlatSolutionNodeInput] = deriveInputObjectType()

}
