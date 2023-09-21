package model

import de.uniwue.ls6.corasModel.AnnotationType
import de.uniwue.ls6.corasModel.levenshtein.Levenshtein

import scala.concurrent.{ExecutionContext, Future}

object AnnotationGenerator {

  private val weightedDistanceThreshold = 0.6

  // FIXME: change type of annotation to something more abstract...
  private type AnnotationFinder = Int => Future[Seq[(Annotation, String)]]

  private type SimilarityChecker = (String, String) => Double

  private val levenshteinSimilarity: SimilarityChecker = (firstText, secondText) =>
    Levenshtein.distance(firstText, secondText).toDouble / Math.max(firstText.length, secondText.length)

  private def generateAnnotationForUserSolutionNodeAndMatch(
    userSolutionNodeText: String,
    aMatch: SolutionNodeMatch,
    selectDataForMatchedSampleNode: AnnotationFinder,
    checkSimilarity: SimilarityChecker
  )(implicit ec: ExecutionContext): Future[Option[Annotation]] = selectDataForMatchedSampleNode(aMatch.sampleValue).map { annotations =>
    val weightedAnnotations = for {
      // filter out annotations for same user
      (annotation, nodeText) <- annotations.filter { _._1.username != aMatch.username }

      weightedDistance = checkSimilarity(userSolutionNodeText, nodeText)

      filteredAnnotation = annotation if weightedDistance > weightedDistanceThreshold
    } yield (filteredAnnotation, weightedDistance)

    // take highest ranked remaining annotation (could be none...) TODO: maybe take all?
    weightedAnnotations.maxByOption { _._2 }.map { _._1 }
  }

  private def findAnnotationsForUserSolutionNode(
    userSolutionNodeId: Int,
    userSolutionNodeText: String,
    matches: Seq[SolutionNodeMatch],
    selectDataForMatchedSampleNode: AnnotationFinder
  )(implicit ec: ExecutionContext): Future[Seq[Annotation]] = for {
    generatedAnnotationOptions <- Future.traverse(matches.filter { _.userValue == userSolutionNodeId }) { aMatch =>
      generateAnnotationForUserSolutionNodeAndMatch(userSolutionNodeText, aMatch, selectDataForMatchedSampleNode, levenshteinSimilarity)
    }
  } yield generatedAnnotationOptions.flatten

  def generateAnnotations(
    userSolution: Seq[FlatUserSolutionNode],
    matches: Seq[SolutionNodeMatch],
    selectDataForMatchedSampleNode: AnnotationFinder
  )(implicit ec: ExecutionContext): Future[Seq[Annotation]] = for {

    generatedAnnotationsForNode <- Future.traverse(userSolution) {
      case FlatUserSolutionNode(username, exId, userNodeId, _ /* childIndex */, _ /* isSubText */, userNodeText, _ /* applicability */, _ /* parentId */ ) =>
        for {
          foundAnnotations <- findAnnotationsForUserSolutionNode(userNodeId, userNodeText, matches, selectDataForMatchedSampleNode)

          generatedAnnotations = foundAnnotations.zipWithIndex.map {
            case (Annotation(_, _, _, _, errorType, importance, _ /*startIndex*/, _ /*endIndex*/, text, _), id) =>
              // FIXME: update startIndex and endIndex
              val startIndex = 0
              val endIndex   = 0

              Annotation(username, exId, userNodeId, id, errorType, importance, startIndex, endIndex, text, AnnotationType.Manual)
          }
        } yield generatedAnnotations
    }

  } yield generatedAnnotationsForNode.flatten

}
