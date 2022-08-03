package model.matching

sealed trait Match[T] {
  val sampleValue: T
  val userValue: T
}

final case class CertainMatch[T](sampleValue: T, userValue: T) extends Match[T]

final case class FuzzyMatch[T](sampleValue: T, userValue: T, certainty: Double) extends Match[T]

final case class MatchingResult[MatchContentType](
  matches: Seq[Match[MatchContentType]],
  notMatchedSample: Seq[MatchContentType],
  notMatchedUser: Seq[MatchContentType]
)

trait Matcher[T] {

  def performMatching(sampleSolution: Seq[T], userSolution: Seq[T]): MatchingResult[T]

}
