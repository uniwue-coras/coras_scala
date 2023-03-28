package model

import scala.concurrent.Future

trait SolutionNodeRepository {
  self: TableDefs =>

  import profile.api._

  protected type DbSolutionRow = (Int, Int, Int, Boolean, String, Applicability, Option[Int])

  protected type DbUserSolutionRow = (String, DbSolutionRow)

  protected val sampleSolutionNodesTQ = TableQuery[SampleSolutionNodesTable]
  protected val userSolutionNodesTQ   = TableQuery[UserSolutionNodesTable]

  def futureSampleSolutionForExercise(exerciseId: Int): Future[Seq[FlatSampleSolutionNode]] = for {
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

  def futureNodesForUserSolution(username: String, exerciseId: Int): Future[Seq[FlatUserSolutionNode]] = for {
    nodeTuples <- db.run(
      userSolutionNodesTQ
        .filter { sol => sol.username === username && sol.exerciseId === exerciseId }
        .sortBy(_.id)
        .result
    )
  } yield nodeTuples

  protected abstract class SolutionsTable[Node](tag: Tag, tableName: String) extends Table[Node](tag, s"${tableName}_solution_nodes") {
    def exerciseId    = column[Int]("exercise_id")
    def id            = column[Int]("id")
    def childIndex    = column[Int]("child_index")
    def isSubText     = column[Boolean]("is_subtext")
    def text          = column[String]("text")
    def applicability = column[Applicability]("applicability")
    def parentId      = column[Option[Int]]("parent_id")
  }

  protected class SampleSolutionNodesTable(tag: Tag) extends SolutionsTable[FlatSampleSolutionNode](tag, "sample") {

    // noinspection ScalaUnusedSymbol
    def pk = primaryKey("sample_solutions_pk", (exerciseId, id))

    // noinspection ScalaUnusedSymbol
    def exerciseFk = foreignKey(s"${tableName}_solution_exercise_fk", exerciseId, exercisesTQ)(_.id, onUpdate = cascade, onDelete = cascade)

    override def * = (exerciseId, id, childIndex, isSubText, text, applicability, parentId) <> (FlatSampleSolutionNode.tupled, FlatSampleSolutionNode.unapply)

  }

  protected class UserSolutionNodesTable(tag: Tag) extends SolutionsTable[FlatUserSolutionNode](tag, "user") {

    def username = column[String]("username")

    // noinspection ScalaUnusedSymbol
    def pk = primaryKey("user_solution_pk", (username, exerciseId, id))

    // noinspection ScalaUnusedSymbol
    def userFk = foreignKey("user_solution_user_fk", username, userSolutionsTQ)(_.username, onUpdate = cascade, onDelete = cascade)

    override def * =
      (username, exerciseId, id, childIndex, isSubText, text, applicability, parentId) <> (FlatUserSolutionNode.tupled, FlatUserSolutionNode.unapply)
  }

}