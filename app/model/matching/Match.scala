package model.matching

trait MatchExplanation {

  def certainty: Double

}

final case class Match[T, E <: MatchExplanation](
  sampleValue: T,
  userValue: T,
  explanation: Option[E] = None
)
