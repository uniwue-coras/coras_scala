package model

import com.scalatsi.TSType
import com.scalatsi.TypescriptType.TSEnum
import enumeratum.{EnumEntry, PlayEnum}
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType

sealed trait Applicability extends EnumEntry

object Applicability extends PlayEnum[Applicability] {

  override def values: IndexedSeq[Applicability] = findValues

  // values

  case object NotSpecified extends Applicability

  case object NotApplicable extends Applicability

  case object Applicable extends Applicability

  // Types

  val tsType: TSType[Applicability] = TSType(
    TSEnum.string(
      "Applicability",
      Applicability.values.map(app => (app.entryName, app.entryName)): _*
    )
  )

  val graphQLType: EnumType[Applicability] = deriveEnumType()

}
