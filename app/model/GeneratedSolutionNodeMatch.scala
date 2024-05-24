package model

import model.matching.nodeMatching.{AnnotatedSampleSolutionTree, AnnotatedSolutionNode, AnnotatedUserSolutionTree, SolutionNodeMatchExplanation}
import model.matching.paragraphMatching.ParagraphMatcher
import model.matching.{Match, MatchingResult}

import scala.concurrent.Future

final case class GeneratedSolutionNodeMatch(
  exerciseId: Int,
  username: String,
  sampleNodeId: Int,
  userNodeId: Int,
  private val paragraphMatchingResult: Option[ParagraphMatcher.ParagraphMatchingResult],
  explanationCorrectness: Correctness,
  certainty: Option[Double] = None
) extends SolutionNodeMatch {

  override val matchStatus                  = MatchStatus.Automatic
  override def paragraphCitationCorrectness = if (paragraphCitationAnnotations.isEmpty) Correctness.Unspecified else Correctness.Wrong

  lazy val paragraphCitationAnnotations: Seq[ParagraphCitationAnnotation] = paragraphMatchingResult match {
    case None => Seq.empty
    case Some(MatchingResult(matchedParagraphs, missingParagraphs, _ /*wrongParagraphs*/ )) =>
      val matches = for {
        Match(samplePar, userPar, _) <- matchedParagraphs
      } yield ParagraphCitationAnnotation(exerciseId, username, sampleNodeId, userNodeId, samplePar.stringify(), Correctness.Correct, Some(userPar.stringify()))

      val misses = for {
        parCit <- missingParagraphs
      } yield ParagraphCitationAnnotation(exerciseId, username, sampleNodeId, userNodeId, parCit.stringify(), Correctness.Wrong)

      (matches ++ misses)
        .distinctBy { parCit => (parCit.sampleNodeId, parCit.userNodeId, parCit.awaitedParagraph) }
  }

  lazy val explanationAnnotations = explanationCorrectness match {
    case Correctness.Wrong => Seq(ExplanationAnnotation(exerciseId, username, sampleNodeId, userNodeId, "Definition und/oder Subsumptionen fehlen."))
    case _                 => Seq.empty
  }

  override def getParagraphCitationAnnotation(tableDefs: TableDefs, awaitedParagraph: String) = Future.successful {
    paragraphCitationAnnotations.find { _.awaitedParagraph == awaitedParagraph }
  }
  override def getParagraphCitationAnnotations(tableDefs: TableDefs) = Future.successful { paragraphCitationAnnotations }
  override def getExplanationAnnotations(tableDefs: TableDefs)       = Future.successful { explanationAnnotations }

  def forDb: DbSolutionNodeMatch =
    DbSolutionNodeMatch(username, exerciseId, sampleNodeId, userNodeId, paragraphCitationCorrectness, explanationCorrectness, certainty, matchStatus)
}

object GeneratedSolutionNodeMatch {
  def fromSolutionNodeMatch(exerciseId: Int, username: String, m: Match[AnnotatedSolutionNode, SolutionNodeMatchExplanation])(implicit
    sampleTree: AnnotatedSampleSolutionTree,
    userTree: AnnotatedUserSolutionTree
  ) = m match {
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

      GeneratedSolutionNodeMatch(
        exerciseId,
        username,
        sampleValue.id,
        userValue.id,
        paragraphMatchingResult,
        explanationCorrectness,
        explanation.map(_.certainty)
      )
  }
}
