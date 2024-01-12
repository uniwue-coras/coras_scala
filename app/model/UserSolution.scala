package model

import model.exporting.ExportedUserSolution
import scala.concurrent.Future
import scala.concurrent.ExecutionContext

final case class UserSolution(
  username: String,
  exerciseId: Int,
  correctionStatus: CorrectionStatus,
  reviewUuid: Option[String]
) {
  def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedUserSolution] = for {
    userSolutionNodes         <- tableDefs.futureUserSolNodesForUserSolution(username, exerciseId)
    exportedUserSolutionNodes <- Future.traverse(userSolutionNodes) { _.exportData(tableDefs) }

    nodeMatches       <- tableDefs.futureMatchesForUserSolution(username, exerciseId)
    correctionSummary <- tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
  } yield ExportedUserSolution(username, exportedUserSolutionNodes, nodeMatches, correctionStatus, correctionSummary.map { _._2 })
}
