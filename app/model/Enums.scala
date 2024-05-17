package model

import enumeratum.{EnumEntry, PlayEnum}
import sangria.macros.derive.deriveEnumType

sealed trait Importance extends EnumEntry

object Importance extends PlayEnum[Importance] {

  case object Less   extends Importance
  case object Medium extends Importance
  case object More   extends Importance

  override def values = findValues
  val graphQLType     = deriveEnumType[Importance]()
}

sealed trait AnnotationType extends EnumEntry

object AnnotationType extends PlayEnum[AnnotationType] {

  case object Manual            extends AnnotationType
  case object Automatic         extends AnnotationType
  case object RejectedAutomatic extends AnnotationType

  val values: IndexedSeq[AnnotationType] = findValues
  val graphQLType                        = deriveEnumType[AnnotationType]()
}

sealed trait Applicability extends EnumEntry

object Applicability extends PlayEnum[Applicability] {

  case object NotSpecified  extends Applicability
  case object NotApplicable extends Applicability
  case object Applicable    extends Applicability

  override def values = findValues
  val graphQLType     = deriveEnumType[Applicability]()
}

// Correctness

sealed trait Correctness extends EnumEntry

object Correctness extends PlayEnum[Correctness] {
  case object Correct     extends Correctness
  case object Partially   extends Correctness
  case object Wrong       extends Correctness
  case object Unspecified extends Correctness

  def values      = findValues
  val graphQLType = deriveEnumType[Correctness]()
}

// ErrorType

sealed trait ErrorType extends EnumEntry

case object ErrorType extends PlayEnum[ErrorType] {

  case object Neutral extends ErrorType
  case object Missing extends ErrorType
  case object Wrong   extends ErrorType

  override def values = findValues
  val graphQLType     = deriveEnumType[ErrorType]()
}

sealed trait MatchStatus extends EnumEntry

object MatchStatus extends PlayEnum[MatchStatus] {

  case object Automatic extends MatchStatus
  case object Manual    extends MatchStatus
  case object Deleted   extends MatchStatus

  override def values = findValues
  val graphQLType     = deriveEnumType[MatchStatus]()
}

sealed trait Rights extends EnumEntry

object Rights extends PlayEnum[Rights] {

  case object Student   extends Rights
  case object Corrector extends Rights
  case object Admin     extends Rights

  override def values = findValues
  val graphQLType     = deriveEnumType[Rights]()
}
