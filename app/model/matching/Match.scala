package model.matching

import model.graphql.GraphQLContext
import play.api.libs.json.{Json, Writes}
import sangria.schema._

trait MatchExplanation:
  def certainty: Double
  def certaintyOverestimate: Double = 1 - Math.pow(1 - certainty, 2)

object MatchExplanation:
  val interfaceType = InterfaceType[GraphQLContext, MatchExplanation](
    "MatchExplanation",
    fields[GraphQLContext, MatchExplanation](
      Field("certainty", FloatType, resolve = _.value.certainty)
    )
  )

final case class Match[T, E <: MatchExplanation](
  sampleValue: T,
  userValue: T,
  explanation: Option[E] = None
)

object Match:
  def matchWrites[T, E <: MatchExplanation](implicit tWrites: Writes[T], eWrites: Writes[E]): Writes[Match[T, E]] = Json.writes

  def queryType[T, E <: MatchExplanation](name: String, tType: OutputType[T], eType: OutputType[E]): ObjectType[GraphQLContext, Match[T, E]] =
    ObjectType[GraphQLContext, Match[T, E]](
      s"${name}Match",
      fields[GraphQLContext, Match[T, E]](
        Field("sampleValue", tType, resolve = _.value.sampleValue),
        Field("userValue", tType, resolve = _.value.userValue),
        Field("maybeExplanation", OptionType(eType), resolve = _.value.explanation)
      )
    )
