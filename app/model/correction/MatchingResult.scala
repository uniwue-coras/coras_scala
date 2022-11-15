package model.correction

final case class Match[T, E](
  sampleValue: T,
  userValue: T,
  explanation: Option[E] = None
)

final case class MatchingResult[T, E](
  matches: Seq[Match[T, E]],
  notMatchedSample: Seq[T] = Seq.empty,
  notMatchedUser: Seq[T] = Seq.empty
) {

  lazy val rate: Double = matches.size + notMatchedSample.size + notMatchedUser.size match {
    case 0     => 0.0
    case other => matches.size.toDouble / other.toDouble
  }

}

object MatchingResult {

  def mergeMatchingResults[T, E](mr1: MatchingResult[T, E], mr2: MatchingResult[T, E]): MatchingResult[T, E] = MatchingResult(
    mr1.matches ++ mr2.matches,
    mr1.notMatchedSample ++ mr2.notMatchedSample,
    mr1.notMatchedUser ++ mr2.notMatchedUser
  )

}
