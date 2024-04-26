package model

import model.matching.nodeMatching.{AnnotatedSampleSolutionTree, AnnotatedSolutionNode, AnnotatedUserSolutionTree, SolutionNodeMatchExplanation}
import model.matching.paragraphMatching.{ParagraphMatcher}
import model.matching.{Match, MatchingResult}

final case class GeneratedSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  paragraphMatchingResult: Option[ParagraphMatcher.ParagraphMatchingResult],
  maybeExplanation: Option[SolutionNodeMatchExplanation]
) extends SolutionNodeMatch {

  override val matchStatus = MatchStatus.Automatic
  override def certainty   = maybeExplanation.map(_.certainty)

  // FIXME: update calculation of correctness entries!
  override def paragraphCitationCorrectness = Correctness.Unspecified
  override def explanationCorrectness       = Correctness.Unspecified

  lazy val paragraphCitationAnnotations: Seq[GeneratedParagraphCitationAnnotation] = paragraphMatchingResult
    .map { case MatchingResult(_ /* matchedParagraphs */, missingParagraphs, _ /*wrongParagraphs*/ ) =>
      missingParagraphs.map { parCit => GeneratedParagraphCitationAnnotation(sampleNodeId, userNodeId, parCit.stringify(), None) }
    }
    .getOrElse(Seq.empty)

  def forDb(exerciseId: Int, username: String): DbSolutionNodeMatch =
    DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, paragraphCitationCorrectness, explanationCorrectness, certainty)
}

object GeneratedSolutionNodeMatch {
  def fromSolutionNodeMatch(
    m: Match[AnnotatedSolutionNode, SolutionNodeMatchExplanation]
  )(implicit sampleTree: AnnotatedSampleSolutionTree, userTree: AnnotatedUserSolutionTree) = m match {
    case Match(sampleValue, userValue, explanation) =>
      // val sampleSubTexts = sampleTree.getSubTextsFor(sampleValue.id)
      // val userSubTexts   = userTree.getSubTextsFor(userValue.id)
      // val subTextMatchingResult = ???

      val sampleAllParagraphs = sampleTree.recursiveCitedParagraphs(sampleValue.id)
      val userAllParagraphs   = userTree.recursiveCitedParagraphs(userValue.id)

      val paragraphMatchingResult = ParagraphMatcher.performMatchingIfNotEmpty(sampleAllParagraphs, userAllParagraphs)

      GeneratedSolutionNodeMatch(sampleValue.id, userValue.id, paragraphMatchingResult, explanation)
  }
}
