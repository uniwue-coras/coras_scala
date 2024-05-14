package model.userSolution

import model.{SolutionIdentifier, TableDefs}

import scala.concurrent.Future

final case class UserSolutionKey(exerciseId: Int, username: String)

trait UserSolutionsRepository {
  self: TableDefs =>

  import profile.api._

  protected object userSolutionsTQ extends TableQuery[UserSolutionsTable](new UserSolutionsTable(_)) {
    def byKey(key: UserSolutionKey) = this.filter { userSol => userSol.exerciseId === key.exerciseId && userSol.username === key.username }
  }

  def futureUserSolutionsForExercise(exerciseId: Int): Future[Seq[UserSolution]] = db.run { userSolutionsTQ.filter { _.exerciseId === exerciseId }.result }

  def futureMaybeUserSolution(key: UserSolutionKey): Future[Option[UserSolution]] = db.run { userSolutionsTQ.byKey { key }.result.headOption }

  def futureSelectUserSolutionByReviewUuid(uuid: String): Future[Option[UserSolution]] = db.run {
    userSolutionsTQ.filter { _.reviewUuid === uuid }.result.headOption
  }

  def futureSelectMySolutionIdentifiers(username: String): Future[Seq[SolutionIdentifier]] = for {
    rows <- db.run(
      exercisesTQ
        .joinLeft { userSolutionsTQ.filter { _.username === username } }
        .on { case (exercises, userSolutions) => exercises.id === userSolutions.exerciseId }
        .map { case (exercises, maybeUserSolution) => (exercises.id, exercises.title, maybeUserSolution.map(_.correctionFinished)) }
        .result
    )
  } yield rows.map { case (id, title, maybeCorrectionStatus) => SolutionIdentifier(id, title, maybeCorrectionStatus) }

  def futureUpdateCorrectionFinished(key: UserSolutionKey, finished: Boolean): Future[Unit] = for {
    _ <- db.run(userSolutionsTQ.byKey { key }.map { _.correctionFinished } update finished)
  } yield ()

  protected class UserSolutionsTable(tag: Tag) extends Table[UserSolution](tag, "user_solutions") {
    def username           = column[String]("username")
    def exerciseId         = column[Int]("exercise_id")
    def correctionFinished = column[Boolean]("correction_finished", O.Default(true))
    def reviewUuid         = column[Option[String]]("review_uuid", O.Default(None))

    def pk         = primaryKey("user_solutions_pk", (username, exerciseId))
    def exerciseFk = foreignKey(s"user_solutions_exercise_fk", exerciseId, exercisesTQ)(_.id, onUpdate = cascade, onDelete = cascade)

    override def * = (username, exerciseId, correctionFinished, reviewUuid).mapTo[UserSolution]
  }
}
