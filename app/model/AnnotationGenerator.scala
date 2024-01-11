package model

import scala.concurrent.{ExecutionContext, Future}

abstract class AnnotationGenerator:

  protected def selectDataForMatchedSampleNode(sampleNodeId: Int): Future[Seq[(Annotation, String)]]

  private val weightedDistanceThreshold = 0.6

  private def levenshteinSimilarity(firstText: String, secondText: String): Double = {
    val dist      = levenshteinDistance(firstText, secondText)
    val maxLength = Math.max(firstText.length, secondText.length)

    dist.toDouble / maxLength
  }

  private def findBestAnnotationCandidate(currentText: String, candidates: Seq[(Annotation, String)]): Option[Annotation] = candidates
    // annotate with similarity
    .map { case (annotation, otherSolutionNodeText) => (annotation, levenshteinSimilarity(currentText, otherSolutionNodeText)) }
    // filter out "bad" annotations
    .filter { case (_, weightedDistance) => weightedDistance >= weightedDistanceThreshold }
    // take highest ranked remaining annotation (could be none...) TODO: maybe take all?
    .maxByOption(_._2)
    .map(_._1)

  private def findAnnotationsForUserSolutionNode(
    userSolutionNodeText: String,
    matchesForNode: Seq[DefaultSolutionNodeMatch]
  )(implicit ec: ExecutionContext): Future[Seq[Annotation]] = for {
    generatedAnnotationOptions <- Future.traverse(matchesForNode) { aMatch =>
      for {
        otherAnnotations <- selectDataForMatchedSampleNode(aMatch.sampleNodeId)
      } yield findBestAnnotationCandidate(userSolutionNodeText, otherAnnotations)
    }
  } yield generatedAnnotationOptions.flatten

  def generateAnnotations(userSolution: Seq[SolutionNode], matches: Seq[DefaultSolutionNodeMatch])(implicit
    ec: ExecutionContext
  ): Future[Seq[(Int, Annotation)]] =
    for {

      generatedAnnotationsForNode <- Future.traverse(userSolution) { userNode =>
        val matchesForNode = matches.filter { _.userNodeId == userNode.id }

        for {
          foundAnnotations <- findAnnotationsForUserSolutionNode(userNode.text, matchesForNode)

          generatedAnnotations = foundAnnotations.zipWithIndex.map { case (anno, id) =>
            // FIXME: update startIndex and endIndex
            val startIndex = 0
            val endIndex   = 0

            val generatedAnnotation = Annotation(id, anno.errorType, anno.importance, startIndex, endIndex, anno.text, AnnotationType.Automatic)

            (userNode.id, generatedAnnotation)
          }
        } yield generatedAnnotations
      }

    } yield generatedAnnotationsForNode.flatten
