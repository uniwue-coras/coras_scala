package model

import com.scalatsi.TypescriptType.{TSLiteralString, TSUnion}
import com.scalatsi.{TSNamedType, TSType}
import enumeratum.{EnumEntry, PlayEnum}

sealed trait Applicability extends EnumEntry

object Applicability extends PlayEnum[Applicability] {

  override def values: IndexedSeq[Applicability] = findValues

  // values

  case object NotSpecified extends Applicability

  case object NotApplicable extends Applicability

  case object Applicable extends Applicability

  val tsType: TSNamedType[Applicability] = TSType.alias[Applicability](
    "Applicability",
    TSUnion {
      Applicability.values.map(app => TSLiteralString(app.entryName))
    }
  )

}
