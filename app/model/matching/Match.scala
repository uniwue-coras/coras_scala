package model.matching

trait MatchExplanation:
  def certainty: Double
  def certaintyOverestimate: Double = 1 - Math.pow(1 - certainty, 2)

final case class Match[T, E <: MatchExplanation](
  sampleValue: T,
  userValue: T,
  explanation: Option[E] = None
)
