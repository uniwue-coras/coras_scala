package model

import model.matching.nodeMatching.{AnnotatedSolutionNode, AnnotatedSolutionNodeMatcher, AnnotatedSolutionTree}
import model.matching.{MatchingResult, WordAnnotator}

import scala.concurrent.{ExecutionContext, Future}

type Certainty = Option[Double]

abstract class AnnotationGenerator(wordAnnotator: WordAnnotator, sampleTree: AnnotatedSolutionTree, userTree: AnnotatedSolutionTree):

  private val weightedDistanceThreshold = 0.8

  protected def selectDataForMatchedSampleNode(sampleNodeId: Int): Future[Seq[(SolutionNode, Annotation)]]

  private val matcher = AnnotatedSolutionNodeMatcher(sampleTree, userTree)

  private def findBestAnnotationCandidate(
    userSolutionNode: AnnotatedSolutionNode,
    candidates: Seq[(AnnotatedSolutionNode, Annotation)]
  ): Option[GeneratedAnnotation] = candidates
    // annotate with similarity
    .map { case (otherSolutionNode, annotation) =>
      // FIXME: use similarity with complete sub tree!
      (annotation, matcher.generateFuzzyMatchExplanation(userSolutionNode, otherSolutionNode).certainty)
    }
    // filter out "bad" annotations
    .filter { case (_, weightedDistance) => weightedDistance >= weightedDistanceThreshold }
    // take highest ranked remaining annotation (could be none...) TODO: maybe take all?
    .maxByOption { _._2 }
    .map { case (Annotation(_, errorType, importance, _, _, text, _), certainty) =>
      GeneratedAnnotation(-1, -1, errorType, importance, startIndex = 0, endIndex = text.size - 1, text, Some(certainty))
    }

  private def findAnnotationsForUserSolutionNode(
    userSolutionNode: AnnotatedSolutionNode,
    matchesForNode: Seq[(DefaultSolutionNodeMatch, AnnotatedSolutionNode)]
  )(implicit ec: ExecutionContext): Future[Seq[GeneratedAnnotation]] = {
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
            val text     = s"Paragraphzitat fehlt: ${paragraphCitation.stringify()}"
            val endIndex = userSolutionNode.text.size - 1

            GeneratedAnnotation(nodeId = userSolutionNode.id, -1, errorType, annoImportance, startIndex = 0, endIndex = endIndex, text = text, None)
          }

        for {
          annotationsForOtherUserSolNodes <- selectDataForMatchedSampleNode(aMatch.sampleNodeId)
          annotatedAnnotationsForOtherUserSolNodes <- Future.traverse(annotationsForOtherUserSolNodes) { case (solutionNode, annotation) =>
            for {
              annotatedNode <- wordAnnotator.annotateNode(solutionNode)
            } yield (annotatedNode, annotation)
          }
        } yield paragraphComparisonResult ++ findBestAnnotationCandidate(userSolutionNode, annotatedAnnotationsForOtherUserSolNodes)
      }
      .map { _.flatten }
  }

  // TODO: find missing children?
  def generateAnnotations(matches: Seq[DefaultSolutionNodeMatch])(implicit ec: ExecutionContext): Future[Seq[GeneratedAnnotation]] = Future
    .traverse(userTree.nodes) { userNode =>

      // find matches for current user solution node
      val matchesAndSampleNodes = matches
        .filter { aMatch => aMatch.userNodeId == userNode.id && aMatch.certainty.isDefined }
        .sortBy { _.certainty.getOrElse(1.0) }
        .map { m => (m, sampleTree.find(m.sampleNodeId).get) }

      for {
        foundAnnotations <- findAnnotationsForUserSolutionNode(userNode, matchesAndSampleNodes)

        generatedAnnotations = foundAnnotations.zipWithIndex.map { case (generatedAnnotation, index) =>
          generatedAnnotation.copy(nodeId = userNode.id, id = index)
        }
      } yield generatedAnnotations
    }
    .map { _.flatten }
