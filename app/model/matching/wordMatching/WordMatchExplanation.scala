package model.matching.wordMatching

import model.matching.MatchExplanation
import sangria.schema.{ObjectType, fields, Field, IntType}
import model.graphql.GraphQLContext

final case class FuzzyWordMatchExplanation(
  distance: Int,
  maxLength: Int
) extends MatchExplanation {
  override lazy val certainty: Double = (maxLength - distance).toDouble / maxLength.toDouble
}

object FuzzyWordMatchExplanation:
  val queryType: ObjectType[GraphQLContext, FuzzyWordMatchExplanation] = ObjectType(
    "WordMatchExplanation",
    fields[GraphQLContext, FuzzyWordMatchExplanation](
      Field("distance", IntType, resolve = _.value.distance),
      Field("maxLength", IntType, resolve = _.value.maxLength)
    )
  )
