package model


import scala.annotation.unused
import scala.concurrent.{ExecutionContext, Future}

final case class DbAnnotationGenerator(
  username: String,
  exerciseId: Int,
  tableDefs: TableDefs
)(@unused implicit val ec: ExecutionContext)
    extends AnnotationGenerator[FlatUserSolutionNode, DbAnnotation] {

  override protected def createAnnotation(
    userNodeId: Int,
    id: Int,
    errorType: ErrorType,
    annotationImportance: AnnotationImportance,
    startIndex: Int,
    endIndex: Int,
    text: String,
    annotationType: AnnotationType
  ): DbAnnotation = DbAnnotation(username, exerciseId, userNodeId, id, errorType, annotationImportance, startIndex, endIndex, text, annotationType)

  override protected def selectDataForMatchedSampleNode(sampleNodeId: Int): Future[Seq[(DbAnnotation, String)]] = for {
    allAnnotations <- tableDefs.futureSelectUserSolNodesMatchedToSampleSolNode(exerciseId, sampleNodeId)

    // filter out annotations for own solutions
    otherAnnotations = allAnnotations.filter { _._1.username != username }
  } yield otherAnnotations

}
