package model.matching.wordMatching

import model.graphql.GraphQLContext
import model.matching.MatchExplanation
import sangria.schema.{Field, IntType, ObjectType, fields}

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
