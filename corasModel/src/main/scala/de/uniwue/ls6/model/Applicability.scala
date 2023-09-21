package de.uniwue.ls6.model

import enumeratum.{EnumEntry, PlayEnum}

sealed trait Applicability extends EnumEntry

object Applicability extends PlayEnum[Applicability] {

  case object NotSpecified  extends Applicability
  case object NotApplicable extends Applicability
  case object Applicable    extends Applicability

  override def values: IndexedSeq[Applicability] = findValues

}
