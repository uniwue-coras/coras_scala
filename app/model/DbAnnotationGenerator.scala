package model

import scala.concurrent.{ExecutionContext, Future}

final case class DbAnnotationGenerator(
  username: String,
  exerciseId: Int,
  tableDefs: TableDefs
)(implicit val ec: ExecutionContext)
    extends AnnotationGenerator:

  override protected def selectDataForMatchedSampleNode(sampleNodeId: Int): Future[Seq[(Annotation, String)]] = for {
    allAnnotations <- tableDefs.futureSelectUserSolNodesMatchedToSampleSolNode(exerciseId, sampleNodeId)

    // filter out annotations for own solutions
    otherAnnotations = allAnnotations.filter { _._1.username != username }
  } yield otherAnnotations
