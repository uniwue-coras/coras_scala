package de.uniwue.ls6.corasModel

import enumeratum.{EnumEntry, PlayEnum}

sealed trait AnnotationImportance extends EnumEntry

object AnnotationImportance extends PlayEnum[AnnotationImportance] {

  case object Less   extends AnnotationImportance
  case object Medium extends AnnotationImportance
  case object More   extends AnnotationImportance

  override def values: IndexedSeq[AnnotationImportance] = findValues

}
