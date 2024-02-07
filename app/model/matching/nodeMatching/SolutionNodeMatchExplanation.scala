package model.matching.nodeMatching

import model.graphql.GraphQLContext
import model.matching.MatchExplanation
import model.matching.paragraphMatching.{ParagraphMatcher, ParagraphMatchingResult}
import model.matching.wordMatching.{WordMatcher, WordMatchingResult}
import sangria.schema.{Field, ObjectType, OptionType, fields}

final case class SolutionNodeMatchExplanation(
  wordMatchingResult: WordMatchingResult,
  maybeParagraphMatchingResult: Option[ParagraphMatchingResult] = None
) extends MatchExplanation:

  private val paragraphMatchingWeight = 1
  private val wordMatchingWeight      = 9

  override lazy val certainty: Double = maybeParagraphMatchingResult match {
    case None => wordMatchingResult.certainty
    case Some(paragraphMatchingResult) =>
      val parMatchAmount  = paragraphMatchingWeight * paragraphMatchingResult.certainty
      val wordMatchAmount = wordMatchingWeight * wordMatchingResult.certainty

      (parMatchAmount + wordMatchAmount) / (paragraphMatchingWeight + wordMatchingWeight).toDouble
  }

object SolutionNodeMatchExplanation:
  def queryType: ObjectType[GraphQLContext, SolutionNodeMatchExplanation] = ObjectType(
    "SolutionNodeMatchExplanation",
    fields[GraphQLContext, SolutionNodeMatchExplanation](
      Field("wordMatchingResult", WordMatcher.wordMatchingQueryType, resolve = _.value.wordMatchingResult),
      Field("maybePararaphMatchingResult", OptionType(ParagraphMatcher.paragraphMatchingResultQueryType), resolve = _.value.maybeParagraphMatchingResult)
    )
  )
