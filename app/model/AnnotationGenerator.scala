package model

import model.enums.{AnnotationImportance, AnnotationType, ErrorType}
import model.levenshtein.Levenshtein

import scala.concurrent.{ExecutionContext, Future}

abstract class AnnotationGenerator[UserNode <: SolutionNode, Anno <: Annotation] {

  protected def createAnnotation(
    userNodeId: Int,
    id: Int,
    errorType: ErrorType,
    annotationImportance: AnnotationImportance,
    startIndex: Int,
    endIndex: Int,
    text: String,
    annotationType: AnnotationType
  ): Anno

  protected def selectDataForMatchedSampleNode(sampleNodeId: Int): Future[Seq[(Anno, String)]]

  private val weightedDistanceThreshold = 0.6

  private type SimilarityChecker = (String, String) => Double

  private val levenshteinSimilarity: SimilarityChecker = (firstText, secondText) => {
    val dist      = Levenshtein.distance(firstText, secondText)
    val maxLength = Math.max(firstText.length, secondText.length)

    dist.toDouble / maxLength
  }

  private def findBestAnnotationCandidate(currentText: String, candidates: Seq[(Anno, String)]): Option[Anno] = candidates
    // annotate with similarity
    .map { case (annotation, otherSolutionNodeText) => (annotation, levenshteinSimilarity(currentText, otherSolutionNodeText)) }
    // filter out "bad" annotations
    .filter { case (_, weightedDistance) => weightedDistance >= weightedDistanceThreshold }
    // take highest ranked remaining annotation (could be none...) TODO: maybe take all?
    .maxByOption(_._2)
    .map(_._1)

  private def findAnnotationsForUserSolutionNode(
    userSolutionNodeText: String,
    matchesForNode: Seq[SolutionNodeMatch]
  )(implicit ec: ExecutionContext): Future[Seq[Anno]] = for {
    generatedAnnotationOptions <- Future.traverse(matchesForNode) { aMatch =>
      for {
        otherAnnotations <- selectDataForMatchedSampleNode(aMatch.sampleNodeId)
      } yield findBestAnnotationCandidate(userSolutionNodeText, otherAnnotations)
    }
  } yield generatedAnnotationOptions.flatten

  def generateAnnotations(userSolution: Seq[UserNode], matches: Seq[SolutionNodeMatch])(implicit ec: ExecutionContext): Future[Seq[Anno]] = for {

    generatedAnnotationsForNode <- Future.traverse(userSolution) { userNode =>
      val matchesForNode = matches.filter { _.userNodeId == userNode.id }

      for {
        foundAnnotations <- findAnnotationsForUserSolutionNode(userNode.text, matchesForNode)

        generatedAnnotations = foundAnnotations.zipWithIndex.map { case (anno, id) =>
          // FIXME: update startIndex and endIndex
          val startIndex = 0
          val endIndex   = 0

          createAnnotation(userNode.id, id, anno.errorType, anno.importance, startIndex, endIndex, anno.text, enums.AnnotationType.Manual)
        }
      } yield generatedAnnotations
    }

  } yield generatedAnnotationsForNode.flatten

}
