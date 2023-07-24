package model

import scala.concurrent.{ExecutionContext, Future}

object AnnotationGenerator {

  private def generateAnnotationForUserSolutionNode(
    exerciseId: Int,
    username: String,
    sampleSolution: Seq[FlatSampleSolutionNode],
    userSolutionNode: FlatUserSolutionNode,
    matches: Seq[SolutionNodeMatch]
  ): Future[Seq[Annotation]] = {
    val maybeMatch = matches.find { _.userValue == userSolutionNode.id }

    ???
  }

  def generateAnnotations(
    exerciseId: Int,
    username: String,
    sampleSolution: Seq[FlatSampleSolutionNode],
    userSolution: Seq[FlatUserSolutionNode],
    matches: Seq[SolutionNodeMatch]
  )(implicit ec: ExecutionContext): Future[Seq[Annotation]] = Future.sequence {

    val y = for {
      userSolutionNode <- userSolution

      annotations = generateAnnotationForUserSolutionNode(exerciseId, username, sampleSolution, userSolutionNode, matches)
    } yield annotations

    y
  }

}
