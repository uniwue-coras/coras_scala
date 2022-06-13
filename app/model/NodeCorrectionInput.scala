package model

import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.deriveInputObjectType
import sangria.schema.InputObjectType

@deprecated()
final case class NodeCorrectionInput(
  sampleNodeId: Int,
  userNodeId: Int,
  applicabilityCorrect: Boolean,
  applicabilityComment: Option[String],
  definitionComment: Option[String],
  comment: Option[String],
  subTextCorrections: Seq[SubTextCorrectionInput]
)

final case class SubTextCorrectionInput(
  sampleSubTextId: Int,
  userSubTextId: Int,
  applicabilityCorrect: Boolean,
  applicabilityComment: Option[String],
  comment: Option[String]
)

object EntryCorrection {

  val inputType: InputObjectType[NodeCorrectionInput] = {
    implicit val subTextCorrectionInputType: InputObjectType[SubTextCorrectionInput] = deriveInputObjectType()

    deriveInputObjectType()
  }

  val inputJsonFormat: OFormat[NodeCorrectionInput] = {
    implicit val subTextCorrectionInputFormat: OFormat[SubTextCorrectionInput] = Json.format

    Json.format
  }

}
