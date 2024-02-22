package model

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
      (annotation, levenshteinSimilarity(currentText, otherSolutionNodeText))
    }
    // filter out "bad" annotations
    .filter { case (_, weightedDistance) => weightedDistance >= weightedDistanceThreshold }
    // take highest ranked remaining annotation (could be none...) TODO: maybe take all?
    .maxByOption(_._2)
    .map(_._1)

  private def findAnnotationsForUserSolutionNode(
    userSolutionNode: Node,
    matchesForNode: Seq[(SolutionNodeMatch, AnnotatedSolutionNode)]
  )(implicit ec: ExecutionContext): Future[Seq[Annotation]] =
    Future
      .traverse(matchesForNode) { (aMatch, sampleNode) =>
        // TODO: check similarity with sampleNode -> set missing paragraph citations!
        // val similarity = AnnotatedSolutionNodeMatcher.generateFuzzyMatchExplanation(???, ???)

        for {
          otherAnnotations <- selectDataForMatchedSampleNode(aMatch.sampleNodeId)
        } yield findBestAnnotationCandidate(userSolutionNode.text, otherAnnotations)
      }
      .map { _.flatten }

  def generateAnnotations(
    sampleSolution: Seq[AnnotatedSolutionNode],
    userSolution: Seq[AnnotatedSolutionNode],
    matches: Seq[SolutionNodeMatch]
  )(implicit ec: ExecutionContext): Future[Seq[GeneratedAnnotation]] = Future
    .traverse(userSolution) { userNode =>
      // find matches for current user solution node

      val matchesAndSampleNodes = matches
        .filter { _.userNodeId == userNode.id }
        .sortBy { _.certainty.getOrElse(1.0) }
        .map { m => (m, sampleSolution.find { _.id == m.sampleNodeId }.get) }

      for {
        foundAnnotations <- findAnnotationsForUserSolutionNode(userNode, matchesAndSampleNodes)

        generatedAnnotations = foundAnnotations.zipWithIndex.map { case (Annotation(_, errorType, importance, _, _, text, _), id) =>
          // TODO: update startIndex and endIndex
          val startIndex = 0
          val endIndex   = 0

          GeneratedAnnotation(userNode.id, id, errorType, importance, startIndex, endIndex, text)
        }

      } yield generatedAnnotations
    }
    .map { _.flatten }
