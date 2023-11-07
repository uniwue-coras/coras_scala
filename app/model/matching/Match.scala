package model.matching

final case class Match[T, E](
  sampleValue: T,
  userValue: T,
  explanation: Option[E] = None
)
