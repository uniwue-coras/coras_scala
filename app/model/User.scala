package model

import enumeratum.{EnumEntry, PlayEnum}

sealed trait Rights extends EnumEntry

object Rights extends PlayEnum[Rights] {

  case object Student extends Rights

  case object Corrector extends Rights

  case object Admin extends Rights

  override def values: IndexedSeq[Rights] = findValues

}

final case class User(
  username: String,
  maybePasswordHash: Option[String],
  rights: Rights,
  maybe_name: Option[String]
)
