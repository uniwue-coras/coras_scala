package model.matching.paragraphMatching

import model.ParagraphCitation
import model.graphql.GraphQLContext
import model.matching.{CertainMatcher, Match, MatchingResult}
import sangria.schema.ObjectType

type ParagraphCitationMatch  = Match[ParagraphCitation, ParagraphCitationMatchExplanation]
type ParagraphMatchingResult = MatchingResult[ParagraphCitation, ParagraphCitationMatchExplanation]

object ParagraphMatcher extends CertainMatcher[ParagraphCitation, ParagraphCitationMatchExplanation]:

  override protected def checkCertainMatch(left: ParagraphCitation, right: ParagraphCitation): Boolean = {
    val paragraphTypeEqual = left.paragraphType == right.paragraphType
    val lawCodeEqual       = left.lawCode == right.lawCode
    val parNumberEqual     = left.paragraphNumber == right.paragraphNumber

    // TODO: more tests...

    paragraphTypeEqual && lawCodeEqual && parNumberEqual
  }

  val paragraphMatchingResultQueryType: ObjectType[GraphQLContext, ParagraphMatchingResult] =
    MatchingResult.queryType("Paragraph", ParagraphCitation.queryType, ParagraphCitationMatchExplanation.queryType)
