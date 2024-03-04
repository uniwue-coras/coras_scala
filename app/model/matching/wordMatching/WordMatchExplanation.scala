package model.matching.wordMatching

import model.graphql.GraphQLContext
import model.matching.MatchExplanation
import sangria.schema.{Field, IntType, ObjectType, fields, interfaces}

final case class WordMatchExplanation(
  distance: Int,
  maxLength: Int
) extends MatchExplanation:
  override lazy val certainty: Double = (maxLength - distance).toDouble / maxLength.toDouble

object WordMatchExplanation:
  val queryType: ObjectType[GraphQLContext, WordMatchExplanation] = ObjectType(
    "WordMatchExplanation",
    interfaces[GraphQLContext, WordMatchExplanation](MatchExplanation.interfaceType),
    fields[GraphQLContext, WordMatchExplanation](
      Field("distance", IntType, resolve = _.value.distance),
      Field("maxLength", IntType, resolve = _.value.maxLength)
    )
  )
