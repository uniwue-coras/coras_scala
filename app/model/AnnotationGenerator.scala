package model

import scala.concurrent.{ExecutionContext, Future}

object AnnotationGenerator {

  private def generateAnnotationForUserSolutionNode(
    exerciseId: Int,
    username: String,
    sampleSolution: Seq[FlatSampleSolutionNode],
    userSolutionNode: FlatUserSolutionNode,
    matches: Seq[SolutionNodeMatch]
  ): Future[Seq[Annotation]] = matches.find { _.userValue == userSolutionNode.id } match {
    case None            => Future.successful(Seq.empty)
    case Some(mainMatch) => ???
  }

  def generateAnnotations(
    exerciseId: Int,
    username: String,
    sampleSolution: Seq[FlatSampleSolutionNode],
    userSolution: Seq[FlatUserSolutionNode],
    matches: Seq[SolutionNodeMatch]
  )(implicit ec: ExecutionContext): Future[Seq[Annotation]] = for {
    x <- Future.sequence {
      userSolution.map { userSolutionNode =>
        generateAnnotationForUserSolutionNode(exerciseId, username, sampleSolution, userSolutionNode, matches)
      }
    }
  } yield x.flatten

}
