package model

import enumeratum.{EnumEntry, Enum, PlayJsonEnum}
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType

// AnnotationImportance

sealed trait AnnotationImportance extends EnumEntry

object AnnotationImportance extends Enum[AnnotationImportance] with PlayJsonEnum[AnnotationImportance] {

  case object Less   extends AnnotationImportance
  case object Medium extends AnnotationImportance
  case object More   extends AnnotationImportance

  override def values: IndexedSeq[AnnotationImportance] = findValues

}

// AnnotationType

sealed trait AnnotationType extends EnumEntry

object AnnotationType extends Enum[AnnotationType] with PlayJsonEnum[AnnotationType] {

  case object Manual            extends AnnotationType
  case object Automatic         extends AnnotationType
  case object RejectedAutomatic extends AnnotationType

  val values: IndexedSeq[AnnotationType] = findValues

}

// Applicability

sealed trait Applicability extends EnumEntry

object Applicability extends Enum[Applicability] with PlayJsonEnum[Applicability] {

  case object NotSpecified  extends Applicability
  case object NotApplicable extends Applicability
  case object Applicable    extends Applicability

  override def values: IndexedSeq[Applicability] = findValues

}

// CorrectionStatus

sealed trait CorrectionStatus extends EnumEntry

object CorrectionStatus extends Enum[CorrectionStatus] with PlayJsonEnum[CorrectionStatus] {

  case object Waiting  extends CorrectionStatus
  case object Ongoing  extends CorrectionStatus
  case object Finished extends CorrectionStatus

  override def values: IndexedSeq[CorrectionStatus] = findValues

}

// ErrorType

sealed trait ErrorType extends EnumEntry

case object ErrorType extends Enum[ErrorType] with PlayJsonEnum[ErrorType] {

  case object Missing extends ErrorType
  case object Wrong   extends ErrorType

  override def values: IndexedSeq[ErrorType] = findValues

}

// MatchStatus

sealed trait MatchStatus extends EnumEntry

object MatchStatus extends Enum[MatchStatus] with PlayJsonEnum[MatchStatus] {

  case object Automatic extends MatchStatus
  case object Manual    extends MatchStatus
  case object Deleted   extends MatchStatus

  override def values: IndexedSeq[MatchStatus] = findValues

}

// Rights

sealed trait Rights extends EnumEntry

object Rights extends Enum[Rights] with PlayJsonEnum[Rights] {

  case object Student   extends Rights
  case object Corrector extends Rights
  case object Admin     extends Rights

  override def values: IndexedSeq[Rights] = findValues

  val graphQLType: EnumType[Rights] = deriveEnumType()

}
