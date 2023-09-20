package model.exportModel

import model.{Applicability, FlatUserSolutionNode, TableDefs}
import play.api.libs.json.{Json, OFormat}

import scala.annotation.unused
import scala.concurrent.{ExecutionContext, Future}

final case class ExportedFlatUserSolutionNode(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int],
  annotations: Seq[ExportedAnnotation]
)

object ExportedFlatUserSolutionNode extends NodeExporter[FlatUserSolutionNode, ExportedFlatUserSolutionNode] {

  override def exportData(value: FlatUserSolutionNode, tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedFlatUserSolutionNode] = {
    val FlatUserSolutionNode(username, exerciseId, nodeId, childIndex, isSubText, text, applicability, parentId) = value

    for {
      annotations <- tableDefs.futureAnnotationsForUserSolutionNode(username, exerciseId, nodeId)

      exportedAnnotations = annotations.map { annotation => ExportedAnnotation.exportData(annotation) }
    } yield ExportedFlatUserSolutionNode(nodeId, childIndex, isSubText, text, applicability, parentId, exportedAnnotations)
  }

  override val jsonFormat: OFormat[ExportedFlatUserSolutionNode] = {
    @unused implicit val exportedAnnotationJsonFormat: OFormat[ExportedAnnotation] = ExportedAnnotation.jsonFormat

    Json.format
  }

}
