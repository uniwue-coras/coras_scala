package model

import scala.concurrent.Future

final case class SolutionNodeSubText(
  text: String,
  applicability: Applicability
)

final case class FlatSolutionNode(
  id: Int,
  childIndex: Int,
  text: String,
  applicability: Applicability,
  subTexts: Seq[SolutionNodeSubText],
  parentId: Option[Int]
)

trait SolutionRepository {
  self: TableDefs =>

  import MyPostgresProfile.api._

  private type DbSolutionNode = (Int, Int, Int, String, Applicability, Seq[SolutionNodeSubText], Option[Int])

  private def dbSolNode2FlatSolutionNode(node: DbSolutionNode): FlatSolutionNode = node match {
    case (_, id, childIndex, text, applicability, subTexts, parentId) => FlatSolutionNode(id, childIndex, text, applicability, subTexts, parentId)
  }

  protected def flatSolutionNode2DbSolNode(exerciseId: Int, flatSolutionNode: FlatSolutionNode): DbSolutionNode = flatSolutionNode match {
    case FlatSolutionNode(id, childIndex, text, applicability, subTexts, parentId) => (exerciseId, id, childIndex, text, applicability, subTexts, parentId)
  }

  protected object sampleSolutionNodesTQ extends TableQuery[SampleSolutionNodesTable](new SampleSolutionNodesTable(_)) {
    def forExercise(exerciseId: Int): Query[SampleSolutionNodesTable, DbSolutionNode, Seq] = this.filter { _.exerciseId === exerciseId }
  }

  protected object userSolutionNodesTQ extends TableQuery[UserSolutionNodesTable](new UserSolutionNodesTable(_)) {
    def forUserAndExercise(username: String, exerciseId: Int): Query[UserSolutionNodesTable, (String, DbSolutionNode), Seq] = this.filter { sol =>
      sol.username === username && sol.exerciseId === exerciseId
    }
  }

  def futureSampleSolutionForExercise(exerciseId: Int): Future[Seq[FlatSolutionNode]] = for {
    nodeTuples <- db.run(sampleSolutionNodesTQ.forExercise(exerciseId).result)
  } yield nodeTuples.map(dbSolNode2FlatSolutionNode)

  def futureUserSolutionForExercise(username: String, exerciseId: Int): Future[Seq[FlatSolutionNode]] = for {
    nodeTuples <- db.run(userSolutionNodesTQ.forUserAndExercise(username, exerciseId).result)
  } yield nodeTuples.map((node) => dbSolNode2FlatSolutionNode(node._2))

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

  def futureInsertUserSolutionForExercise(username: String, exerciseId: Int, userSolution: Seq[FlatSolutionNode]): Future[Option[Int]] =
    db.run(userSolutionNodesTQ ++= userSolution.map(node => (username, flatSolutionNode2DbSolNode(exerciseId, node))))

  protected abstract class SolutionsTable[Node](tag: Tag, tableName: String) extends Table[Node](tag, s"${tableName}_solution_entries") {

    def exerciseId = column[Int]("exercise_id")

    def id = column[Int]("id")

    def childIndex = column[Int]("child_index")

    def parentId = column[Option[Int]]("parent_id")

    def text = column[String]("text")

    def applicability = column[Applicability]("applicability")

    def subTexts = column[Seq[SolutionNodeSubText]]("sub_texts")

    // noinspection ScalaUnusedSymbol
    def exerciseFk =
      foreignKey(s"${tableName}_solution_exercise_fk", exerciseId, exercisesTQ)(_.id, onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade)

  }

  protected class SampleSolutionNodesTable(tag: Tag) extends SolutionsTable[DbSolutionNode](tag, "sample") {

    // noinspection ScalaUnusedSymbol
    def pk = primaryKey("sample_solutions_pk", (exerciseId, id))

    override def * = (exerciseId, id, childIndex, text, applicability, subTexts, parentId)

  }

  protected class UserSolutionNodesTable(tag: Tag) extends SolutionsTable[(String, DbSolutionNode)](tag, "user") {

    def username = column[String]("username")

    // noinspection ScalaUnusedSymbol
    def pk = primaryKey("user_solution_pk", (username, exerciseId, id))

    // noinspection ScalaUnusedSymbol
    def userFk = foreignKey("user_solution_user_fk", username, usersTQ)(_.username, onUpdate = ForeignKeyAction.Cascade, onDelete = ForeignKeyAction.Cascade)

    override def * = (username, (exerciseId, id, childIndex, text, applicability, subTexts, parentId)).shaped

  }

}
