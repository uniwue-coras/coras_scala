package model

import scala.concurrent.{ExecutionContext, Future}

final case class DbAnnotationGenerator(
  username: String,
  exerciseId: Int,
  tableDefs: TableDefs
)(implicit val ec: ExecutionContext)
    extends AnnotationGenerator:

  override protected def selectDataForMatchedSampleNode(sampleNodeId: Int): Future[Seq[(SolutionNode, Annotation)]] = for {
    allAnnotations <- tableDefs.futureSelectUserSolNodesMatchedToSampleSolNode(exerciseId, sampleNodeId)

    // filter out annotations for own solutions
    otherAnnotations = allAnnotations.filter { _._2.username != username }
  } yield otherAnnotations
