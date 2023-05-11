package model

import enumeratum.{EnumEntry, PlayEnum}
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType

sealed trait AnnotationImportance extends EnumEntry

object AnnotationImportance extends PlayEnum[AnnotationImportance] {

  case object Less   extends AnnotationImportance
  case object Medium extends AnnotationImportance
  case object More   extends AnnotationImportance

  override def values: IndexedSeq[AnnotationImportance] = findValues

  val graphQLType: EnumType[AnnotationImportance] = deriveEnumType()

}
