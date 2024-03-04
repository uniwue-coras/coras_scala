package model

import model.matching.MatchingResult
import model.matching.nodeMatching.AnnotatedSolutionNode

import scala.concurrent.{ExecutionContext, Future}
import model.matching.nodeMatching.AnnotatedSolutionNodeMatcher
import model.matching.WordAnnotator

abstract class AnnotationGenerator:

  private type Node = AnnotatedSolutionNode

  protected type OtherAnnotationsData = Seq[(SolutionNode, Annotation)]

  protected def selectDataForMatchedSampleNode(sampleNodeId: Int): Future[OtherAnnotationsData]

  private val weightedDistanceThreshold = 0.8

  private def findBestAnnotationCandidate(userSolutionNode: AnnotatedSolutionNode, candidates: Seq[(AnnotatedSolutionNode, Annotation)]): Option[Annotation] =
    candidates
      // annotate with similarity
      .map { case (otherSolutionNode, annotation) =>
        // FIXME: use similarity with complete sub tree!

        val similarity = AnnotatedSolutionNodeMatcher.generateFuzzyMatchExplanation(userSolutionNode, otherSolutionNode).certainty

        (annotation, similarity)
      }
      // filter out "bad" annotations
      .filter { case (_, weightedDistance) => weightedDistance >= weightedDistanceThreshold }
      // take highest ranked remaining annotation (could be none...) TODO: maybe take all?
      .maxByOption(_._2)
      .map(_._1)

  private def findAnnotationsForUserSolutionNode(
    wordAnnotator: WordAnnotator,
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
          annotationsForOtherUserSolNodes <- selectDataForMatchedSampleNode(aMatch.sampleNodeId)
          annotatedAnnotationsForOtherUserSolNodes = annotationsForOtherUserSolNodes.map { case (solutionNode, annotation) =>
            (wordAnnotator.annotateNode(solutionNode), annotation)
          }
        } yield paragraphComparisonResult ++ findBestAnnotationCandidate(userSolutionNode, annotatedAnnotationsForOtherUserSolNodes)
      }
      .map { _.flatten }
  }

  // TODO: find missing children?
  def generateAnnotations(
    wordAnnotator: WordAnnotator,
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
        foundAnnotations <- findAnnotationsForUserSolutionNode(wordAnnotator, userNode, matchesAndSampleNodes)

        generatedAnnotations = foundAnnotations.zipWithIndex.map { case (Annotation(_, errorType, importance, _, _, text, _), id) =>
          GeneratedAnnotation(userNode.id, id, errorType, importance, startIndex = 0, endIndex = text.length() - 1, text = text)
        }
      } yield generatedAnnotations
    }
    .map { _.flatten }
