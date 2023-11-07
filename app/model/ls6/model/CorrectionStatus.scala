package model.ls6.model

import enumeratum.{EnumEntry, PlayEnum}

sealed trait CorrectionStatus extends EnumEntry

object CorrectionStatus extends PlayEnum[CorrectionStatus] {

  case object Waiting  extends CorrectionStatus
  case object Ongoing  extends CorrectionStatus
  case object Finished extends CorrectionStatus

  override def values: IndexedSeq[CorrectionStatus] = findValues

}
