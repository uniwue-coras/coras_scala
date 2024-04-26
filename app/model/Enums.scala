package model

import enumeratum.{EnumEntry, PlayEnum}
import sangria.macros.derive.deriveEnumType

// AnnotationImportance

sealed trait AnnotationImportance extends EnumEntry

object AnnotationImportance extends PlayEnum[AnnotationImportance] {

  case object Less   extends AnnotationImportance
  case object Medium extends AnnotationImportance
  case object More   extends AnnotationImportance

  override def values = findValues
  val graphQLType     = deriveEnumType[AnnotationImportance]()
}

// AnnotationType

sealed trait AnnotationType extends EnumEntry

object AnnotationType extends PlayEnum[AnnotationType] {

  case object Manual            extends AnnotationType
  case object Automatic         extends AnnotationType
  case object RejectedAutomatic extends AnnotationType

  val values: IndexedSeq[AnnotationType] = findValues
  val graphQLType                        = deriveEnumType[AnnotationType]()
}

// Applicability

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

// CorrectionStatus

sealed trait CorrectionStatus extends EnumEntry

object CorrectionStatus extends PlayEnum[CorrectionStatus] {

  case object Waiting  extends CorrectionStatus
  case object Ongoing  extends CorrectionStatus
  case object Finished extends CorrectionStatus

  override def values = findValues
  val graphQLType     = deriveEnumType[CorrectionStatus]()
}

// ErrorType

sealed trait ErrorType extends EnumEntry

case object ErrorType extends PlayEnum[ErrorType] {

  case object Missing extends ErrorType
  case object Wrong   extends ErrorType

  override def values = findValues
  val graphQLType     = deriveEnumType[ErrorType]()
}

// MatchStatus

sealed trait MatchStatus extends EnumEntry

object MatchStatus extends PlayEnum[MatchStatus] {

  case object Automatic extends MatchStatus
  case object Manual    extends MatchStatus
  case object Deleted   extends MatchStatus

  override def values = findValues
  val graphQLType     = deriveEnumType[MatchStatus]()
}

// Rights

sealed trait Rights extends EnumEntry

object Rights extends PlayEnum[Rights] {

  case object Student   extends Rights
  case object Corrector extends Rights
  case object Admin     extends Rights

  override def values = findValues
  val graphQLType     = deriveEnumType[Rights]()
}
