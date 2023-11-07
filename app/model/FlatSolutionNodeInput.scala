package model

import model.ls6.model.Applicability
import model.graphql.MyInputType
import sangria.macros.derive.{deriveEnumType, deriveInputObjectType}
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

  @unused private implicit val applicabilityGraphQLType: EnumType[Applicability] = deriveEnumType()

  override val inputType: InputObjectType[FlatSolutionNodeInput] = deriveInputObjectType()

}
