package model.matching

final case class MatchingResult[T, E <: MatchExplanation](
  matches: Seq[Match[T, E]],
  notMatchedSample: Seq[T] = Seq.empty,
  notMatchedUser: Seq[T] = Seq.empty
) extends MatchExplanation:

  override lazy val certainty: Double = matches.size + notMatchedSample.size + notMatchedUser.size match {
    case 0          => 0.0
    case matchCount => matches.map { _.explanation.map(_.certaintyOverestimate).getOrElse(1.0) }.sum / matchCount.toDouble
  }

  def +(that: MatchingResult[T, E]): MatchingResult[T, E] = MatchingResult(
    this.matches ++ that.matches,
    this.notMatchedSample ++ that.notMatchedSample,
    this.notMatchedUser ++ that.notMatchedUser
  )
