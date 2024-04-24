package model.userSolution

import model.exporting.{ExportedFlatUserSolutionNode, NodeExportable}
import model.{Applicability, SolutionNode, TableDefs}

import scala.concurrent.{ExecutionContext, Future}

final case class UserSolutionNode(
  username: String,
  exerciseId: Int,
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends SolutionNode
    with NodeExportable[ExportedFlatUserSolutionNode]:

  override def exportData(tableDefs: TableDefs)(using ExecutionContext): Future[ExportedFlatUserSolutionNode] = for {
    annotations <- tableDefs.futureAnnotationsForUserSolutionNode(username, exerciseId, id)

    exportedAnnotations = annotations.map { _.exportData }
  } yield ExportedFlatUserSolutionNode(id, childIndex, isSubText, text, applicability, parentId, exportedAnnotations)
