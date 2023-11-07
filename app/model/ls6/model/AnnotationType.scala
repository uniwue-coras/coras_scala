package model.ls6.model

import enumeratum.{EnumEntry, PlayEnum}

sealed trait AnnotationType extends EnumEntry

object AnnotationType extends PlayEnum[AnnotationType] {

  case object Manual            extends AnnotationType
  case object Automatic         extends AnnotationType
  case object RejectedAutomatic extends AnnotationType

  val values: IndexedSeq[AnnotationType] = findValues

}
