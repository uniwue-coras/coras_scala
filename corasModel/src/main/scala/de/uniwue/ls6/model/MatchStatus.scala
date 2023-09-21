package de.uniwue.ls6.model

import enumeratum.{EnumEntry, PlayEnum}

sealed trait MatchStatus extends EnumEntry

object MatchStatus extends PlayEnum[MatchStatus] {

  case object Automatic extends MatchStatus
  case object Manual    extends MatchStatus
  case object Deleted   extends MatchStatus

  override def values: IndexedSeq[MatchStatus] = findValues

}
