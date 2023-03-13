package model

import scala.concurrent.Future

trait SolutionNodeRepository {
  self: TableDefs =>

  import profile.api._

  protected type DbSolutionRow = (Int, Int, Int, Boolean, String, Applicability, Option[Int])

  protected type DbUserSolutionRow = (String, DbSolutionRow)

  protected val sampleSolutionNodesTQ = TableQuery[SampleSolutionNodesTable]

  protected object userSolutionNodesTQ extends TableQuery[UserSolutionNodesTable](new UserSolutionNodesTable(_)) {
    def forUserAndExercise(username: String, exerciseId: Int): Query[UserSolutionNodesTable, FlatUserSolutionNode, Seq] =
      this.filter { sol => sol.username === username && sol.exerciseId === exerciseId }
  }

  def futureSampleSolutionForExercise(exerciseId: Int): Future[Seq[FlatSolutionNode]] = for {
    nodeTuples <- db.run(sampleSolutionNodesTQ.filter { _.exerciseId === exerciseId }.sortBy(_.id).result)
  } yield nodeTuples

  def futureUserSolutionNodeForExercise(username: String, exerciseId: Int, nodeId: Int): Future[Option[FlatUserSolutionNode]] = for {
    node <- db.run(
      userSolutionNodesTQ
        .filter { node => node.username === username && node.exerciseId === exerciseId && node.id === nodeId }
        .result
        .headOption
    )
  } yield node

  def futureUserSolutionForExercise(username: String, exerciseId: Int): Future[Seq[FlatUserSolutionNode]] = for {
    nodeTuples <- db.run(userSolutionNodesTQ.forUserAndExercise(username, exerciseId).sortBy(_.id).result)
  } yield nodeTuples

  def futureUserHasSubmittedSolution(exerciseId: Int, username: String): Future[Boolean] = for {
    lineCount <- db.run(userSolutionNodesTQ.forUserAndExercise(username, exerciseId).length.result)
  } yield lineCount > 0

  def futureUsersWithSolution(exerciseId: Int): Future[Seq[String]] = db.run(
    userSolutionNodesTQ
      .filter { _.exerciseId === exerciseId }
      .map { _.username }
      .distinct
      .result
  )

  protected abstract class SolutionsTable[Node](tag: Tag, tableName: String) extends Table[Node](tag, s"${tableName}_solution_nodes") {

    def exerciseId = column[Int]("exercise_id")

    def id = column[Int]("id")

    def childIndex = column[Int]("child_index")

    def isSubText = column[Boolean]("is_subtext")

    def text = column[String]("text")

    def applicability = column[Applicability]("applicability")

    def parentId = column[Option[Int]]("parent_id")

    // noinspection ScalaUnusedSymbol
    def exerciseFk =
      foreignKey(s"${tableName}_solution_exercise_fk", exerciseId, exercisesTQ)(
        _.id,
        onUpdate = ForeignKeyAction.Cascade,
        onDelete = ForeignKeyAction.Cascade
      )

  }

  protected class SampleSolutionNodesTable(tag: Tag) extends SolutionsTable[FlatSolutionNode](tag, "sample") {

    // noinspection ScalaUnusedSymbol
    def pk = primaryKey("sample_solutions_pk", (exerciseId, id))

    override def * = (exerciseId, id, childIndex, isSubText, text, applicability, parentId) <> (FlatSolutionNode.tupled, FlatSolutionNode.unapply)

  }

  protected class UserSolutionNodesTable(tag: Tag) extends SolutionsTable[FlatUserSolutionNode](tag, "user") {

    def username = column[String]("username")

    // noinspection ScalaUnusedSymbol
    def pk = primaryKey("user_solution_pk", (username, exerciseId, id))

    // noinspection ScalaUnusedSymbol
    def userFk = foreignKey("user_solution_user_fk", username, usersTQ)(
      _.username,
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * =
      (username, exerciseId, id, childIndex, isSubText, text, applicability, parentId) <> (FlatUserSolutionNode.tupled, FlatUserSolutionNode.unapply)
  }

}
