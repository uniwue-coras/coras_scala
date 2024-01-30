package model.matching.nodeMatching

import model.graphql.GraphQLContext
import model.matching.paragraphMatching.{ParagraphMatcher, ParagraphMatchingResult}
import model.matching.wordMatching.{WordMatcher, WordMatchingResult}
import model.matching.{MatchExplanation}
import sangria.schema.{Field, ObjectType, OptionType, fields, StringType}

final case class SolutionNodeMatchExplanation(
  wordMatchingResult: WordMatchingResult,
  maybeParagraphMatchingResult: Option[ParagraphMatchingResult] = None,
  subTextMatchingResult: Option[SubTextMatchingResult] = None
) extends MatchExplanation:

  private val wordMatchingWeight      = 8
  private val paragraphMatchingWeight = 2
  private val subTextMatchingWeight   = 6

  override lazy val certainty: Double = {
    // TODO: ignore if wordMatchingResult.certainty < 0.5?

    val wordMatchAmount = wordMatchingWeight * wordMatchingResult.certainty

    val (parMatchAmount, parMatchAdder) = maybeParagraphMatchingResult match
      case Some(mr) => (paragraphMatchingWeight * mr.certainty, paragraphMatchingWeight)
      case None     => (0.0, 0)

    val (subTextMatchAmount, subTextMatchAdder) = subTextMatchingResult match
      case Some(mr) => (subTextMatchingWeight * mr.certainty, subTextMatchingWeight)
      case None     => (0.0, 0)

    (wordMatchAmount + parMatchAmount + subTextMatchAmount) / (wordMatchingWeight + parMatchAdder + subTextMatchAdder)
  }

object SolutionNodeMatchExplanation:
  def queryType: ObjectType[GraphQLContext, SolutionNodeMatchExplanation] = ObjectType(
    "SolutionNodeMatchExplanation",
    fields[GraphQLContext, SolutionNodeMatchExplanation](
      Field("wordMatchingResult", WordMatcher.wordMatchingQueryType, resolve = _.value.wordMatchingResult),
      Field("maybePararaphMatchingResult", OptionType(ParagraphMatcher.paragraphMatchingResultQueryType), resolve = _.value.maybeParagraphMatchingResult),
      // TODO: implement type + resolver!
      Field("maybeSubTextMatchingResult", OptionType(StringType), resolve = _ => None)
    )
  )
