package model.exportModel

import model.{CorrectionStatus, TableDefs, UserSolution}
import play.api.libs.json.{Json, OFormat}

import scala.annotation.unused
import scala.concurrent.{ExecutionContext, Future}

final case class ExportedUserSolution(
  username: String,
  userSolutionNodes: Seq[ExportedFlatUserSolutionNode],
  correctionStatus: CorrectionStatus
)

object ExportedUserSolution extends NodeExporter[UserSolution, ExportedUserSolution] {

  override def exportData(userSolution: UserSolution, tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedUserSolution] = {
    val UserSolution(username, exerciseId, correctionStatus, _ /* reviewUuid */ ) = userSolution

    for {
      userSolutionNodes <- tableDefs.futureNodesForUserSolution(username, exerciseId)

      exportedUserSolutionNodes <- Future.traverse(userSolutionNodes) { userSolutionNode =>
        ExportedFlatUserSolutionNode.exportData(userSolutionNode, tableDefs)
      }
    } yield ExportedUserSolution(username, exportedUserSolutionNodes, correctionStatus)
  }

  override val jsonFormat: OFormat[ExportedUserSolution] = {
    @unused implicit val exportedFlatUserSolutionNodeJsonFormat: OFormat[ExportedFlatUserSolutionNode] = ExportedFlatUserSolutionNode.jsonFormat

    Json.format
  }

}
