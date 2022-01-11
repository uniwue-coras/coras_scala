package model

import enumeratum.{EnumEntry, PlayEnum}
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType

sealed trait Applicability extends EnumEntry

object Applicability extends PlayEnum[Applicability] {

  override def values: IndexedSeq[Applicability] = findValues

  // values

  case object Applicable extends Applicability

  case object NotApplicable extends Applicability

  case object NotSpecified extends Applicability

  // graphQL type

  val graphQLType: EnumType[Applicability] = deriveEnumType[Applicability]()

}
