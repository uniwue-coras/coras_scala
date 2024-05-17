package model

import sangria.macros.derive.deriveInputObjectType
import sangria.schema.InputObjectType

final case class SolutionNodeInput(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  focusIntensity: Option[Importance],
  parentId: Option[Int]
) extends SolutionNode

object SolutionNodeInput {
  val inputType: InputObjectType[SolutionNodeInput] = {
    implicit val applicabilityType = Applicability.graphQLType
    implicit val importanceType    = Importance.graphQLType

    deriveInputObjectType[SolutionNodeInput]()
  }
}
