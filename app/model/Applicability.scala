package model

import com.scalatsi.TSType
import com.scalatsi.TypescriptType.{TSLiteralString, TSUnion}
import enumeratum.{EnumEntry, PlayEnum}
import sangria.macros.derive.deriveEnumType
import sangria.schema.EnumType

sealed trait Applicability extends EnumEntry

object Applicability extends PlayEnum[Applicability] {

  override def values: IndexedSeq[Applicability] = findValues

  // values

  case object NotSpecified extends Applicability

  case object NotApplicable extends Applicability

  case object Applicable extends Applicability

  // graphQL type

  val graphQLType: EnumType[Applicability] = deriveEnumType[Applicability]()

  val tsType: TSType[Applicability] = TSType {
    TSUnion {
      Applicability.values.map(app => TSLiteralString(app.entryName))
    }
  }

}
