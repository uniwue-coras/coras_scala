package model.matching

import model.graphql.GraphQLContext
import play.api.libs.json.{Json, Writes}
import sangria.schema.{Field, ListType, ObjectType, fields}

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

object MatchingResult:
  def empty[T, E <: MatchExplanation]: MatchingResult[T, E] = MatchingResult(Seq.empty, Seq.empty, Seq.empty)

  def writesWithCertainty[T, E <: MatchExplanation](implicit tWrites: Writes[T], eWrites: Writes[E]): Writes[MatchingResult[T, E]] = {
    implicit val mWrites: Writes[Match[T, E]] = Match.matchWrites

    (mr: MatchingResult[T, E]) =>
      Json.obj(
        "matches"          -> mr.matches,
        "notMatchedSample" -> mr.notMatchedSample,
        "notMatchedUser"   -> mr.notMatchedUser,
        "certainty"        -> mr.certainty
      )
  }

  def queryType[T, E <: MatchExplanation](
    name: String,
    tType: ObjectType[GraphQLContext, T],
    eType: ObjectType[GraphQLContext, E]
  ): ObjectType[GraphQLContext, MatchingResult[T, E]] = ObjectType(
    s"${name}MatchingResult",
    fields[GraphQLContext, MatchingResult[T, E]](
      Field("matches", ListType(Match.queryType(name, tType, eType)), resolve = _.value.matches),
      Field("notMatchedSample", ListType(tType), resolve = _.value.notMatchedSample),
      Field("notMatchedUser", ListType(tType), resolve = _.value.notMatchedUser)
    )
  )
