package model.graphql

import model.{CorrectionSummary, CorrectionSummaryInput}
import sangria.macros.derive.deriveInputObjectType
import sangria.schema.{Field, InputObjectType, IntType, ObjectType, StringType, fields}

object CorrectionSummaryGraphQLTypes extends GraphQLBasics {

  val inputType: InputObjectType[CorrectionSummaryInput] = deriveInputObjectType()

  val queryType: ObjectType[Unit, CorrectionSummary] = ObjectType(
    "CorrectionSummary",
    fields[Unit, CorrectionSummary](
      Field("comment", StringType, resolve = _.value.comment),
      Field("points", IntType, resolve = _.value.points)
    )
  )

}
