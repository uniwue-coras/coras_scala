package model

import model.graphql.GraphQLContext
import model.matching.nodeMatching.{AnnotatedSampleSolutionTree, AnnotatedSolutionNode, AnnotatedUserSolutionTree, SolutionNodeMatchExplanation}
import model.matching.paragraphMatching.{ParagraphMatcher, ParagraphMatchingResult}
import model.matching.{Match, MatchingResult}
import sangria.schema._

import scala.concurrent.Future

final case class DefaultSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  paragraphMatchingResult: Option[ParagraphMatchingResult],
  maybeExplanation: Option[SolutionNodeMatchExplanation]
) extends SolutionNodeMatch:

  override val matchStatus               = MatchStatus.Automatic
  override def certainty: Option[Double] = maybeExplanation.map(_.certainty)

  // FIXME: update calculation of correctness entries!
  override def paragraphCitationCorrectness = paragraphMatchingResult.map { _ => Correctness.Wrong } getOrElse Correctness.Unspecified
  override def explanationCorrectness       = Correctness.Unspecified

  override def paragraphCitationAnnotations(tableDefs: TableDefs): Future[Seq[ParagraphCitationAnnotation]] = Future.successful {
    paragraphMatchingResult
      .map { case MatchingResult(_ /* matchedParagraphs */, missingParagraphs, _ /*wrongParagraphs*/ ) =>
        missingParagraphs.map { parCit => DbParagraphCitationAnnotation(???, ???, sampleNodeId, userNodeId, parCit.stringify(), None) }
      }
      .getOrElse(Seq.empty)
  }

  def forDb(exerciseId: Int, username: String): DbSolutionNodeMatch = DbSolutionNodeMatch(
    username,
    exerciseId,
    sampleNodeId,
    userNodeId,
    MatchStatus.Automatic,
    paragraphCitationCorrectness,
    explanationCorrectness,
    certainty
  )

object DefaultSolutionNodeMatch:
  val queryType: ObjectType[GraphQLContext, DefaultSolutionNodeMatch] = ObjectType(
    "DefaultSolutionNodeMatch",
    interfaces(SolutionNodeMatch.interfaceType),
    fields[GraphQLContext, DefaultSolutionNodeMatch](
      Field("paragraphMatchingResult", OptionType(ParagraphMatcher.paragraphMatchingResultQueryType), resolve = _.value.paragraphMatchingResult),
      Field("maybeExplanation", OptionType(SolutionNodeMatchExplanation.queryType), resolve = _.value.maybeExplanation)
    )
  )

  def fromSolutionNodeMatch(
    m: Match[AnnotatedSolutionNode, SolutionNodeMatchExplanation]
  )(using sampleTree: AnnotatedSampleSolutionTree, userTree: AnnotatedUserSolutionTree) = m match {
    case Match(sampleValue, userValue, explanation) =>
      // val sampleSubTexts = sampleTree.getSubTextsFor(sampleValue.id)
      // val userSubTexts   = userTree.getSubTextsFor(userValue.id)
      // val subTextMatchingResult = ???

      val sampleAllParagraphs = sampleTree.recursiveCitedParagraphs(sampleValue.id)
      val userAllParagraphs   = userTree.recursiveCitedParagraphs(userValue.id)

      val paragraphMatchingResult = ParagraphMatcher.performMatchingIfNotEmpty(sampleAllParagraphs, userAllParagraphs)

      DefaultSolutionNodeMatch(sampleValue.id, userValue.id, paragraphMatchingResult, explanation)
  }
