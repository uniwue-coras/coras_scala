package model.matching

trait MatchExplanation:
  def certainty: Double
  def certaintyOverestimate: Double = 1 - Math.pow(1 - certainty, 2)

sealed trait Match[T, E]:
  def sampleValue: T
  def userValue: T

final case class CertainMatch[T](
  sampleValue: T,
  userValue: T
) extends Match[T, Nothing]

final case class FuzzyMatch[T, E <: MatchExplanation](
  sampleValue: T,
  userValue: T,
  explanation: E
) extends Match[T, E]
