package model.matching.nodeMatching

import model.graphql.GraphQLContext
import model.matching.paragraphMatching.{ParagraphMatcher, ParagraphMatchingResult}
import model.matching.wordMatching.{WordMatcher, WordMatchingResult}
import model.matching.{MatchExplanation, MatchingResult}
import sangria.schema.{Field, FloatType, ObjectType, OptionType, fields}

final case class SolutionNodeMatchExplanation(
  maybeWordMatchingResult: Option[WordMatchingResult],
  maybeParagraphMatchingResult: Option[ParagraphMatchingResult]
) extends MatchExplanation:

  private lazy val matchingResult: Seq[MatchingResult[?, ?]] = (maybeWordMatchingResult ++ maybeParagraphMatchingResult).toSeq

  override lazy val certainty: Double = (matchingResult.map { _.certainty }.sum / matchingResult.size * 100.0).ceil / 100.0

object SolutionNodeMatchExplanation:
  def queryType: ObjectType[GraphQLContext, SolutionNodeMatchExplanation] = ObjectType(
    "SolutionNodeMatchExplanation",
    fields[GraphQLContext, SolutionNodeMatchExplanation](
      Field("maybeWordMatchingResult", OptionType(WordMatcher.wordMatchingQueryType), resolve = _.value.maybeWordMatchingResult),
      Field("maybePararaphMatchingResult", OptionType(ParagraphMatcher.paragraphMatchingResultQueryType), resolve = _.value.maybeParagraphMatchingResult),
      Field("certainty", FloatType, resolve = _.value.certainty)
    )
  )
