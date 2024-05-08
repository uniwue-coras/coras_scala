package model

import model.matching.nodeMatching.{AnnotatedSampleSolutionTree, AnnotatedSolutionNode, AnnotatedUserSolutionTree, SolutionNodeMatchExplanation}
import model.matching.paragraphMatching.ParagraphMatcher
import model.matching.{Match, MatchingResult}
import scala.concurrent.Future

final case class GeneratedSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  paragraphMatchingResult: Option[ParagraphMatcher.ParagraphMatchingResult],
  explanationCorrectness: Correctness,
  maybeExplanation: Option[SolutionNodeMatchExplanation]
) extends SolutionNodeMatch {

  override val matchStatus                  = MatchStatus.Automatic
  override def certainty                    = maybeExplanation.map(_.certainty)
  override def paragraphCitationCorrectness = if (paragraphCitationAnnotations.isEmpty) Correctness.Unspecified else Correctness.Wrong

  lazy val paragraphCitationAnnotations: Seq[GeneratedParagraphCitationAnnotation] = paragraphMatchingResult match {
    case None => Seq.empty
    case Some(MatchingResult(matchedParagraphs, missingParagraphs, _ /*wrongParagraphs*/ )) =>
      val matches = for {
        Match(samplePar, userPar, _) <- matchedParagraphs
      } yield GeneratedParagraphCitationAnnotation(sampleNodeId, userNodeId, samplePar.stringify(), Correctness.Correct, Some(userPar.stringify()))

      val misses = for {
        parCit <- missingParagraphs
      } yield GeneratedParagraphCitationAnnotation(sampleNodeId, userNodeId, parCit.stringify(), Correctness.Wrong, None)

      (matches ++ misses)
        .distinctBy { parCit => (parCit.sampleNodeId, parCit.userNodeId, parCit.awaitedParagraph) }
  }

  // TODO: generate annotation for explanations...
  lazy val explanationAnnotation = explanationCorrectness match {
    case Correctness.Wrong => Some(GeneratedExplanationAnnotation(sampleNodeId, userNodeId, "Definition und/oder Subsumptionen fehlen."))
    case _                 => None
  }

  override def getParagraphCitationAnnotations(tableDefs: TableDefs)                                 = Future.successful { paragraphCitationAnnotations }
  override def getExplanationAnnotation(tableDefs: TableDefs): Future[Option[ExplanationAnnotation]] = Future.successful { explanationAnnotation }

  def forDb(exerciseId: Int, username: String, matchStatus: MatchStatus = MatchStatus.Automatic): DbSolutionNodeMatch =
    DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, paragraphCitationCorrectness, explanationCorrectness, certainty, matchStatus)
}

object GeneratedSolutionNodeMatch {
  def fromSolutionNodeMatch(
    m: Match[AnnotatedSolutionNode, SolutionNodeMatchExplanation]
  )(implicit sampleTree: AnnotatedSampleSolutionTree, userTree: AnnotatedUserSolutionTree) = m match {
    case Match(sampleValue, userValue, explanation) =>
      val sampleSubTexts = sampleTree.getSubTextsFor(sampleValue.id)
      val userSubTexts   = userTree.getSubTextsFor(userValue.id)

      // TODO: update calculation of correctness entries: check defs!
      val explanationCorrectness = if (sampleSubTexts.isEmpty) {
        if (userSubTexts.isEmpty) Correctness.Unspecified else Correctness.Correct
      } else {
        if (userSubTexts.isEmpty) Correctness.Wrong else Correctness.Partially
      }

      val paragraphMatchingResult = ParagraphMatcher.performMatchingIfNotEmpty(
        sampleTree.recursiveCitedParagraphs(sampleValue.id),
        userTree.recursiveCitedParagraphs(userValue.id)
      )

      GeneratedSolutionNodeMatch(sampleValue.id, userValue.id, paragraphMatchingResult, explanationCorrectness, explanation)
  }
}
