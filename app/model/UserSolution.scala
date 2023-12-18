package model

import model.exporting.{ExportedUserSolution, NodeExportable}

import scala.concurrent.{ExecutionContext, Future}

final case class UserSolutionInput(
  username: String,
  solution: Seq[FlatSolutionNodeInput]
)

final case class UserSolution(
  username: String,
  exerciseId: Int,
  correctionStatus: CorrectionStatus,
  reviewUuid: Option[String]
) extends NodeExportable[ExportedUserSolution]:
  override def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedUserSolution] = for {
    userSolutionNodes         <- tableDefs.futureAllUserSolNodesForUserSolution(username, exerciseId)
    exportedUserSolutionNodes <- Future.traverse(userSolutionNodes) { _.exportData(tableDefs) }

    nodeMatches <- tableDefs.futureMatchesForUserSolution(username, exerciseId)
    exportedNodeMatches = nodeMatches.map { _.exportData }

    correctionSummary <- tableDefs.futureCorrectionSummaryForSolution(exerciseId, username)
    exportedCorrectionSummary = correctionSummary.map { _.exportData }
  } yield ExportedUserSolution(username, exportedUserSolutionNodes, exportedNodeMatches, correctionStatus, exportedCorrectionSummary)

trait UserSolutionsRepository:
  self: TableDefs =>

  import profile.api._

  protected val userSolutionsTQ = TableQuery[UserSolutionsTable]

  def futureUserSolutionsForExercise(exerciseId: Int): Future[Seq[UserSolution]] = db.run { userSolutionsTQ.filter { _.exerciseId === exerciseId }.result }

  def futureMaybeUserSolution(username: String, exerciseId: Int): Future[Option[UserSolution]] = db.run {
    userSolutionsTQ
      .filter { userSol => userSol.username === username && userSol.exerciseId === exerciseId }
      .result
      .headOption
  }

  def futureSelectUserSolutionByReviewUuid(uuid: String): Future[Option[UserSolution]] = db.run {
    userSolutionsTQ
      .filter { _.reviewUuid === uuid }
      .result
      .headOption
  }

  def futureSelectMySolutionIdentifiers(username: String): Future[Seq[SolutionIdentifier]] = for {
    rows <- db.run(
      exercisesTQ
        .joinLeft { userSolutionsTQ.filter { _.username === username } }
        .on { case (exercises, userSolutions) => exercises.id === userSolutions.exerciseId }
        .map { case (exercises, maybeUserSolution) => (exercises.id, exercises.title, maybeUserSolution.map(_.correctionStatus)) }
        .result
    )
  } yield rows.map { case (id, title, maybeCorrectionStatus) => SolutionIdentifier(id, title, maybeCorrectionStatus) }

  def futureUpdateCorrectionStatus(exerciseId: Int, username: String, newCorrectionStatus: CorrectionStatus): Future[Unit] = for {
    _ <- db.run(
      userSolutionsTQ
        .filter { userSol => userSol.username === username && userSol.exerciseId === exerciseId }
        .map { _.correctionStatus }
        .update(newCorrectionStatus)
    )
  } yield ()

  protected class UserSolutionsTable(tag: Tag) extends Table[UserSolution](tag, "user_solutions"):
    def username         = column[String]("username")
    def exerciseId       = column[Int]("exercise_id")
    def correctionStatus = column[CorrectionStatus]("correction_status", O.Default(CorrectionStatus.Waiting))
    def reviewUuid       = column[Option[String]]("review_uuid", O.Default(None))

    def pk         = primaryKey("user_solutions_pk", (username, exerciseId))
    def exerciseFk = foreignKey(s"user_solutions_exercise_fk", exerciseId, exercisesTQ)(_.id, onUpdate = cascade, onDelete = cascade)

    override def * = (username, exerciseId, correctionStatus, reviewUuid).mapTo[UserSolution]
