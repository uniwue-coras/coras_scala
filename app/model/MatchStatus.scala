package model

import enumeratum.{EnumEntry, PlayEnum}
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType

sealed trait MatchStatus extends EnumEntry

object MatchStatus extends PlayEnum[MatchStatus] {

  case object Automatic extends MatchStatus
  case object Manual    extends MatchStatus
  case object Deleted   extends MatchStatus

  override def values: IndexedSeq[MatchStatus] = findValues

  val graphQLType: EnumType[MatchStatus] = deriveEnumType()

}
