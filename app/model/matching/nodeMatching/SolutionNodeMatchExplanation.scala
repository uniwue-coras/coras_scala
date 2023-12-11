package model.matching.nodeMatching

import model.graphql.GraphQLContext
import model.matching.paragraphMatching.{ParagraphMatcher, ParagraphMatchingResult}
import model.matching.wordMatching.{WordMatcher, WordMatchingResult}
import model.matching.{MatchExplanation, MatchingParameters}
import sangria.schema.{Field, ObjectType, OptionType, fields}

final case class SolutionNodeMatchExplanation(
  wordMatchingResult: WordMatchingResult,
  maybeParagraphMatchingResult: Option[ParagraphMatchingResult] = None
) extends MatchExplanation:

  private val paragraphMatchingProportion = MatchingParameters.paragraphMatchingCertaintyProportion

  override lazy val certainty: Double = maybeParagraphMatchingResult match {
    case None                          => wordMatchingResult.certainty
    case Some(paragraphMatchingResult) =>
      // TODO: ignore if wordMatchingResult.certainty < 0.5?
      val parMatchAmount  = paragraphMatchingProportion * paragraphMatchingResult.certainty
      val wordMatchAmount = (1 - paragraphMatchingProportion) * wordMatchingResult.certainty

      parMatchAmount + wordMatchAmount
  }

object SolutionNodeMatchExplanation:
  def queryType: ObjectType[GraphQLContext, SolutionNodeMatchExplanation] = ObjectType(
    "SolutionNodeMatchExplanation",
    fields[GraphQLContext, SolutionNodeMatchExplanation](
      Field("wordMatchingResult", WordMatcher.wordMatchingQueryType, resolve = _.value.wordMatchingResult),
      Field("maybePararaphMatchingResult", OptionType(ParagraphMatcher.paragraphMatchingResultQueryType), resolve = _.value.maybeParagraphMatchingResult)
    )
  )
