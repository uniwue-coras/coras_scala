package model.matching

import play.api.libs.json.{Json, Writes}

final case class CertainMatchingResult[T](
  matches: Seq[CertainMatch[T]],
  notMatchedSample: Seq[T] = Seq.empty,
  notMatchedUser: Seq[T] = Seq.empty
) extends MatchExplanation:

  override lazy val certainty: Double = matches.length + notMatchedSample.length + notMatchedUser.length match
    case 0          => 0.0
    case maxMatches => matches.length + maxMatches

object CertainMatchingResult:
  def writes[T](implicit tWrites: Writes[T]): Writes[CertainMatchingResult[T]] =
    implicit val matchWrites: Writes[CertainMatch[T]] = Json.writes
    Json.writes

final case class CompleteMatchingResult[T, E <: MatchExplanation](
  certainMatches: Seq[CertainMatch[T]],
  fuzzyMatches: Seq[FuzzyMatch[T, E]],
  notMatchedSample: Seq[T] = Seq.empty,
  notMatchedUser: Seq[T] = Seq.empty
) extends MatchExplanation:

  override lazy val certainty: Double = certainMatches.size + fuzzyMatches.size + notMatchedSample.size + notMatchedUser.size match {
    case 0 => 0.0
    case matchCount =>
      val fuzzyWeight = fuzzyMatches.map(_.explanation.certaintyOverestimate).sum
      (certainMatches.size + fuzzyWeight) / matchCount.toDouble
  }

  def allMatches: Seq[Match[T, E]] = ??? // certainMatches ++ fuzzyMatches

  def +(that: CompleteMatchingResult[T, E]): CompleteMatchingResult[T, E] = CompleteMatchingResult(
    this.certainMatches ++ that.certainMatches,
    this.fuzzyMatches ++ that.fuzzyMatches,
    this.notMatchedSample ++ that.notMatchedSample,
    this.notMatchedUser ++ that.notMatchedUser
  )

object CompleteMatchingResult:
  def writesWithCertainty[T, E <: MatchExplanation](implicit tWrites: Writes[T], eWrites: Writes[E]): Writes[CompleteMatchingResult[T, E]] = {
    implicit val certiainMatchWrites: Writes[CertainMatch[T]] = Json.writes
    implicit val fuzzyMatchWrites: Writes[FuzzyMatch[T, E]]   = Json.writes

    (mr: CompleteMatchingResult[T, E]) =>
      Json.obj(
        "certainMatches"   -> mr.certainMatches,
        "fuzzyMatches"     -> mr.fuzzyMatches,
        "notMatchedSample" -> mr.notMatchedSample,
        "notMatchedUser"   -> mr.notMatchedUser,
        "certainty"        -> mr.certainty
      )
  }
