package model

import enumeratum.{EnumEntry, PlayEnum}
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType

sealed trait Rights extends EnumEntry

object Rights extends PlayEnum[Rights] {

  override def values: IndexedSeq[Rights] = findValues

  // Values

  case object Student extends Rights

  case object Corrector extends Rights

  case object Admin extends Rights

  // GraphQL type

  val graphQLType: EnumType[Rights] = deriveEnumType()

}
