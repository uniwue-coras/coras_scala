package model.matching

import model.SolutionEntry

trait Match[T] {
  val sampleValue: T
  val userValue: T
}

trait MatchingResult[T, M <: Match[T]] {
  val matches: Seq[M]
  val notMatchedSample: Seq[T]
  val notMatchedUser: Seq[T]
}
