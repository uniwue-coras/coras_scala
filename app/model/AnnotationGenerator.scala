package model

import model.levenshtein.Levenshtein
import de.uniwue.ls6.corasModel.AnnotationType

import scala.concurrent.{ExecutionContext, Future}

object AnnotationGenerator {

  private val weightedDistanceThreshold = 0.6

  private def generateAnnotationForUserSolutionNodeAndMatch(
    userSolutionNodeText: String,
    aMatch: SolutionNodeMatch,
    selectDataForMatchedSampleNode: (Int, Int) => Future[Seq[(Annotation, String)]]
  )(implicit ec: ExecutionContext): Future[Option[Annotation]] = selectDataForMatchedSampleNode(aMatch.exerciseId, aMatch.sampleValue).map { annotations =>
    // find *other* matched user sol nodes with corresponding annotations

    // mark annotations with relevance, take only ones that pass threshold
    val weightedAnnotations = for {
      (annotation, nodeText) <- annotations.filter { _._1.username != aMatch.username }

      weightedDistance = Levenshtein.distance(userSolutionNodeText, nodeText).toDouble / Math.max(userSolutionNodeText.length, nodeText.length)

      filteredAnnotation = annotation if weightedDistance > weightedDistanceThreshold
    } yield (filteredAnnotation, weightedDistance)

    // take highest ranked remaining annotation (could be none...) TODO: maybe take all?
    weightedAnnotations.maxByOption { _._2 }.map { _._1 }
  }

  private def findAnnotationsForUserSolutionNode(
    userSolutionNode: FlatUserSolutionNode,
    matches: Seq[SolutionNodeMatch],
    selectDataForMatchedSampleNode: (Int, Int) => Future[Seq[(Annotation, String)]]
  )(implicit ec: ExecutionContext): Future[Seq[Annotation]] = for {
    generatedAnnotationOptions <- Future.traverse(matches.filter { _.userValue == userSolutionNode.id }) { aMatch =>
      generateAnnotationForUserSolutionNodeAndMatch(userSolutionNode.text, aMatch, selectDataForMatchedSampleNode)
    }
  } yield generatedAnnotationOptions.flatten

  def generateAnnotations(
    userSolution: Seq[FlatUserSolutionNode],
    matches: Seq[SolutionNodeMatch],
    tableDefs: TableDefs
  )(implicit ec: ExecutionContext): Future[Seq[Annotation]] = for {
    generatedAnnotationsForNode <- Future.traverse(userSolution) { userSolutionNode =>
      for {
        foundAnnotations <- findAnnotationsForUserSolutionNode(userSolutionNode, matches, tableDefs.futureSelectUserSolNodesMatchedToSampleSolNode)

        generatedAnnotations = foundAnnotations.zipWithIndex.map {
          case (Annotation(_, _, _, _, errorType, importance, _ /*startIndex*/, _ /*endIndex*/, text, _), id) =>
            // FIXME: update startIndex and endIndex
            Annotation(
              userSolutionNode.username,
              userSolutionNode.exerciseId,
              userSolutionNode.id,
              id,
              errorType,
              importance,
              startIndex = 0,
              endIndex = 1,
              text,
              annotationType = AnnotationType.Manual
            )
        }
      } yield generatedAnnotations
    }
  } yield generatedAnnotationsForNode.flatten

}
