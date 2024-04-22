package model

import model.graphql.GraphQLContext
import model.matching.Match
import model.matching.nodeMatching.{AnnotatedSolutionNode, AnnotatedSolutionTree, SolutionNodeMatchExplanation}
import model.matching.paragraphMatching.{ParagraphMatcher, ParagraphMatchingResult}
import sangria.schema._

final case class DefaultSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  paragraphMatchingResult: Option[ParagraphMatchingResult],
  maybeExplanation: Option[SolutionNodeMatchExplanation]
) extends SolutionNodeMatch:

  override val matchStatus               = MatchStatus.Automatic
  override def certainty: Option[Double] = maybeExplanation.map(_.certainty)

  override def correctness: Correctness = maybeExplanation.map { _.correctness } getOrElse Correctness.Correct

object DefaultSolutionNodeMatch:
  val queryType: ObjectType[GraphQLContext, DefaultSolutionNodeMatch] = ObjectType(
    "DefaultSolutionNodeMatch",
    interfaces(SolutionNodeMatch.interfaceType),
    fields[GraphQLContext, DefaultSolutionNodeMatch](
      Field("paragraphMatchingResult", OptionType(ParagraphMatcher.paragraphMatchingResultQueryType), resolve = _.value.paragraphMatchingResult),
      Field("maybeExplanation", OptionType(SolutionNodeMatchExplanation.queryType), resolve = _.value.maybeExplanation)
    )
  )

  private type NodeMatch = Match[AnnotatedSolutionNode, SolutionNodeMatchExplanation]

  def fromSolutionNodeMatch(m: NodeMatch, sampleTree: AnnotatedSolutionTree, userTree: AnnotatedSolutionTree) = {
    val Match(sampleValue, userValue, explanation) = m

    // val sampleSubTexts = sampleTree.getSubTextsFor(sampleValue.id)
    // val userSubTexts   = userTree.getSubTextsFor(userValue.id)
    // val subTextMatchingResult = ???

    val sampleAllParagraphs = sampleTree.recursiveCitedParagraphs(sampleValue.id)
    val userAllParagraphs   = userTree.recursiveCitedParagraphs(userValue.id)

    val paragraphMatchingResult = ParagraphMatcher.performMatchingIfNotEmpty(sampleAllParagraphs, userAllParagraphs)

    DefaultSolutionNodeMatch(sampleValue.id, userValue.id, paragraphMatchingResult, explanation)
  }
