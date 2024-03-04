package model

import model.matching.MatchingResult
import model.matching.nodeMatching.AnnotatedSolutionNode

import scala.concurrent.{ExecutionContext, Future}

abstract class AnnotationGenerator:

  private type Node = AnnotatedSolutionNode

  protected def selectDataForMatchedSampleNode(sampleNodeId: Int): Future[Seq[(Annotation, String)]]

  private val weightedDistanceThreshold = 0.8

  /** @depreacted() */
  private def levenshteinSimilarity(firstText: String, secondText: String) = {
    val dist      = levenshteinDistance(firstText, secondText)
    val maxLength = Math.max(firstText.length, secondText.length)

    dist.toDouble / maxLength
  }

  private def findBestAnnotationCandidate(currentText: String, candidates: Seq[(Annotation, String)]): Option[Annotation] = candidates
    // annotate with similarity
    .map { case (annotation, otherSolutionNodeText) =>
      // FIXME: use similarity with complete sub tree!
      (annotation, levenshteinSimilarity(currentText, otherSolutionNodeText))
    }
    // filter out "bad" annotations
    .filter { case (_, weightedDistance) => weightedDistance >= weightedDistanceThreshold }
    // take highest ranked remaining annotation (could be none...) TODO: maybe take all?
    .maxByOption(_._2)
    .map(_._1)

  private def findAnnotationsForUserSolutionNode(
    userSolutionNode: Node,
    matchesForNode: Seq[(DefaultSolutionNodeMatch, AnnotatedSolutionNode)]
  )(implicit ec: ExecutionContext): Future[Seq[Annotation]] = {
    val errorType      = ErrorType.Missing
    val annoImportance = AnnotationImportance.Medium

    // FIXME: use paragraphs cited in sub nodes!

    Future
      .traverse(matchesForNode) { (aMatch, _ /* sampleNode*/ ) =>

        val paragraphComparisonResult = aMatch.maybeExplanation
          .flatMap { _.maybeParagraphMatchingResult }
          .map { case MatchingResult(_, missingParagraphs, _) => missingParagraphs }
          .getOrElse { Seq.empty }
          .map { case paragraphCitation =>
            val text = s"Paragraphzitat fehlt: ${paragraphCitation.stringify()}"

            GeneratedAnnotation(-1, -1, errorType, annoImportance, startIndex = 0, endIndex = userSolutionNode.text.length() - 1, text = text)
          }

        for {
          otherAnnotations <- selectDataForMatchedSampleNode(aMatch.sampleNodeId)
        } yield paragraphComparisonResult ++ findBestAnnotationCandidate(userSolutionNode.text, otherAnnotations)
      }
      .map { _.flatten }
  }

  // TODO: find missing children?
  def generateAnnotations(
    sampleSolution: Seq[AnnotatedSolutionNode],
    userSolution: Seq[AnnotatedSolutionNode],
    matches: Seq[DefaultSolutionNodeMatch]
  )(implicit ec: ExecutionContext): Future[Seq[GeneratedAnnotation]] = Future
    .traverse(userSolution) { userNode =>

      // find matches for current user solution node
      val matchesAndSampleNodes = matches
        .filter { aMatch => aMatch.userNodeId == userNode.id && aMatch.certainty.isDefined }
        .sortBy { _.certainty.getOrElse(1.0) }
        .map { m => (m, sampleSolution.find { _.id == m.sampleNodeId }.get) }

      for {
        foundAnnotations <- findAnnotationsForUserSolutionNode(userNode, matchesAndSampleNodes)

        generatedAnnotations = foundAnnotations.zipWithIndex.map { case (Annotation(_, errorType, importance, _, _, text, _), id) =>
          GeneratedAnnotation(userNode.id, id, errorType, importance, startIndex = 0, endIndex = text.length() - 1, text = text)
        }
      } yield generatedAnnotations
    }
    .map { _.flatten }
