package model.matching

import model.graphql.GraphQLContext
import play.api.libs.json.{Json, Writes}
import sangria.schema.{Field, ObjectType, OptionType, fields}

trait MatchExplanation:
  def certainty: Double
  def certaintyOverestimate: Double = 1 - Math.pow(1 - certainty, 2)

final case class Match[T, E <: MatchExplanation](
  sampleValue: T,
  userValue: T,
  explanation: Option[E] = None
)

object Match:
  def matchWrites[T, E <: MatchExplanation](implicit tWrites: Writes[T], eWrites: Writes[E]): Writes[Match[T, E]] = Json.writes

  def queryType[T, E <: MatchExplanation](
    name: String,
    tType: ObjectType[GraphQLContext, T],
    eType: ObjectType[GraphQLContext, E]
  ): ObjectType[GraphQLContext, Match[T, E]] = ObjectType[GraphQLContext, Match[T, E]](
    s"${name}Match",
    fields[GraphQLContext, Match[T, E]](
      Field("sampleValue", tType, resolve = _.value.sampleValue),
      Field("userValue", tType, resolve = _.value.userValue),
      Field("maybeExplanation", OptionType(eType), resolve = _.value.explanation)
    )
  )

/*
TODO:

sealed trait AMatch[T]:
  def sampleValue: T
  def userValue: T

final case class CertainMatch[T](
  sampleValue: T,
  userValue: T
) extends AMatch[T]

final case class FuzzyMatch[T, E <: MatchExplanation](
  sampleValue: T,
  userValue: T,
  explanation: E
) extends AMatch[T]
 */
