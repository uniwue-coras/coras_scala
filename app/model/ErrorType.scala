package model

import enumeratum.{EnumEntry, PlayEnum}
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType

sealed trait ErrorType extends EnumEntry

case object ErrorType extends PlayEnum[ErrorType] {

  case object Missing extends ErrorType

  case object Wrong extends ErrorType

  override def values: IndexedSeq[ErrorType] = findValues

  val graphQLEnumType: EnumType[ErrorType] = deriveEnumType()

}
