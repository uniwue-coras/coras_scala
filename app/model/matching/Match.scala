package model.matching

import play.api.libs.json.{Json, Writes}

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
