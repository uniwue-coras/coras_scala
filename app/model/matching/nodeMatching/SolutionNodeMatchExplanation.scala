package model.matching.nodeMatching

import model.graphql.GraphQLContext
import model.matching.paragraphMatching.{ParagraphMatcher, ParagraphMatchingResult}
import model.matching.wordMatching.{WordMatcher, WordMatchingResult}
import model.matching.{MatchExplanation, MatchingResult}
import sangria.schema.{Field, FloatType, ObjectType, OptionType, fields}

final case class SolutionNodeMatchExplanation(
  maybeWordMatchingResult: Option[WordMatchingResult],
  maybeParagraphMatchingResult: Option[ParagraphMatchingResult],
  maybeDirectChildrenMatchingResult: Option[NodeMatchingResult] = None
) extends MatchExplanation:

  private lazy val matchingResults: Seq[MatchingResult[?, ?]] =
    (maybeWordMatchingResult ++ maybeParagraphMatchingResult ++ maybeDirectChildrenMatchingResult).toSeq

  override lazy val certainty: Double = (matchingResults.map { _.certainty }.sum / matchingResults.size * 100.0).ceil / 100.0

object SolutionNodeMatchExplanation:
  def queryType: ObjectType[GraphQLContext, SolutionNodeMatchExplanation] = ObjectType(
    "SolutionNodeMatchExplanation",
    fields[GraphQLContext, SolutionNodeMatchExplanation](
      Field("maybeWordMatchingResult", OptionType(WordMatcher.wordMatchingQueryType), resolve = _.value.maybeWordMatchingResult),
      Field("maybePararaphMatchingResult", OptionType(ParagraphMatcher.paragraphMatchingResultQueryType), resolve = _.value.maybeParagraphMatchingResult),
      Field("maybeDirectChildrenMatchingResult", OptionType(AnnotatedSolutionNodeMatcher.queryType), resolve = _.value.maybeDirectChildrenMatchingResult),
      Field("certainty", FloatType, resolve = _.value.certainty)
    )
  )
