package de.uniwue.ls6.model

import enumeratum.{EnumEntry, PlayEnum}

sealed trait ErrorType extends EnumEntry

case object ErrorType extends PlayEnum[ErrorType] {

  case object Missing extends ErrorType
  case object Wrong   extends ErrorType

  override def values: IndexedSeq[ErrorType] = findValues

}
