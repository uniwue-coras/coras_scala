package model

import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.deriveInputObjectType
import sangria.schema.InputObjectType

final case class EntryCorrectionInput(
  sampleEntryId: Int,
  userEntryId: Int,
  applicabilityCorrect: Boolean,
  applicabilityComment: Option[String],
  definitionComment: Option[String],
  comment: Option[String],
  subTextCorrections: Seq[SubTextCorrectionInput],
  paragraphCitationCorrections: Seq[ParagraphCitationCorrectionInput]
)

final case class SubTextCorrectionInput(
  sampleSubTextId: Int,
  userSubTextId: Int,
  applicabilityCorrect: Boolean,
  applicabilityComment: Option[String],
  comment: Option[String]
)

final case class ParagraphCitationCorrectionInput(
  sampleParagraphCitationId: Int,
  userParagraphCitationId: Int,
  comment: Option[String]
)

object EntryCorrection {

  val inputType: InputObjectType[EntryCorrectionInput] = {
    implicit val subTextCorrectionInputType: InputObjectType[SubTextCorrectionInput]                     = deriveInputObjectType()
    implicit val paragraphCitationCorrectionInputType: InputObjectType[ParagraphCitationCorrectionInput] = deriveInputObjectType()

    deriveInputObjectType()
  }

  val inputJsonFormat: OFormat[EntryCorrectionInput] = {
    implicit val subTextCorrectionInputFormat: OFormat[SubTextCorrectionInput]               = Json.format
    implicit val paragraphCitationCorrectionInput: OFormat[ParagraphCitationCorrectionInput] = Json.format

    Json.format
  }

}
