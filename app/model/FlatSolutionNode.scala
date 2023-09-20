package model

import de.uniwue.ls6.corasModel.{Applicability, ExportedFlatSampleSolutionNode, ExportedFlatUserSolutionNode}

import scala.concurrent.{ExecutionContext, Future}

trait IFlatSolutionNode {
  val exerciseId: Int
  val id: Int
  val childIndex: Int
  val isSubText: Boolean
  val text: String
  val applicability: Applicability
  val parentId: Option[Int]
}

final case class FlatSampleSolutionNode(
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends IFlatSolutionNode
    with LeafExportable[ExportedFlatSampleSolutionNode] {

  override def exportData: ExportedFlatSampleSolutionNode = ExportedFlatSampleSolutionNode(id, childIndex, isSubText, text, applicability, parentId)

}

final case class FlatUserSolutionNode(
  username: String,
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends IFlatSolutionNode
    with NodeExportable[ExportedFlatUserSolutionNode] {

  override def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedFlatUserSolutionNode] = for {
    annotations <- tableDefs.futureAnnotationsForUserSolutionNode(username, exerciseId, id)

    exportedAnnotations = annotations.map { _.exportData }
  } yield ExportedFlatUserSolutionNode(id, childIndex, isSubText, text, applicability, parentId, exportedAnnotations)

}

final case class FlatSolutionNodeInput(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
)
