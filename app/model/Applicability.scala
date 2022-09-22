package model

import enumeratum.{EnumEntry, PlayEnum}
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType

sealed trait Applicability extends EnumEntry

object Applicability extends PlayEnum[Applicability] {

  override def values: IndexedSeq[Applicability] = findValues

  case object NotSpecified extends Applicability

  case object NotApplicable extends Applicability

  case object Applicable extends Applicability

  val graphQLType: EnumType[Applicability] = deriveEnumType()

}
