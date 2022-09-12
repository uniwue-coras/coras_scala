package model

import scala.concurrent.Future

final case class UserSolution(
  username: String,
  exerciseId: Int,
  solution: Seq[SolutionNode]
)

trait UserSolutionRepository {
  self: TableDefs =>

  import MyPostgresProfile.api._

  protected def userSolutionsTQ = TableQuery[UserSolutionsTable]

  private def forExAndUser(exerciseId: Int, username: String) = userSolutionsTQ
    .filter { us => us.username === username && us.exerciseId === exerciseId }

  def futureUserSolutionForExercise(exerciseId: Int, username: String): Future[Option[UserSolution]] =
    db.run(forExAndUser(exerciseId, username).result.headOption)

  def futureInsertUserSolution(username: String, exerciseId: Int, solution: Seq[SolutionNode]): Future[Boolean] = for {
    lineCount <- db.run(userSolutionsTQ += UserSolution(username, exerciseId, solution))
  } yield lineCount == 1

  def futureUsersWithSolution(exerciseId: Int): Future[Seq[String]] = db.run(userSolutionsTQ.filter(_.exerciseId === exerciseId).map(_.username).result)

  def futureUserHasSubmittedSolution(exerciseId: Int, username: String): Future[Boolean] = for {
    lineCount <- db.run(forExAndUser(exerciseId, username).length.result)
  } yield lineCount > 0

  def futureDeleteUserSolution(exerciseId: Int, username: String): Future[Unit] = for {
    _ <- db.run(forExAndUser(exerciseId, username).delete)
  } yield ()

  protected class UserSolutionsTable(tag: Tag) extends Table[UserSolution](tag, "user_solutions") {

    def username = column[String]("username")

    def exerciseId = column[Int]("exercise_id")

    def solution = column[Seq[SolutionNode]]("solution_json")

    // noinspection ScalaUnusedSymbol
    def pk = primaryKey("user_solutions_pk", (username, exerciseId))

    // noinspection ScalaUnusedSymbol
    def usersFk = foreignKey("user_solutions_user_fk", username, usersTQ)(_.username)

    // noinspection ScalaUnusedSymbol
    def exercisesFk =
      foreignKey("user_solutions_exercise_fk", exerciseId, exercisesTQ)(_.id, onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade)

    override def * = (username, exerciseId, solution) <> (UserSolution.tupled, UserSolution.unapply)
  }

}
