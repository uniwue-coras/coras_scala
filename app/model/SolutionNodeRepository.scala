package model

import scala.concurrent.Future

trait SolutionNodeRepository:
  self: TableDefs =>

  import profile.api._

  protected object sampleSolutionNodesTQ extends TableQuery[SampleSolutionNodesTable](new SampleSolutionNodesTable(_))

  protected object userSolutionNodesTQ extends TableQuery[UserSolutionNodesTable](new UserSolutionNodesTable(_)):
    def byId(username: String, exId: Int, id: Int): Query[UserSolutionNodesTable, FlatUserSolutionNode, Seq] =
      this.filter { n => n.username === username && n.exerciseId === exId && n.id === id }

  def futureSampleSolutionForExercise(exerciseId: Int): Future[Seq[FlatSampleSolutionNode]] =
    db.run { sampleSolutionNodesTQ.filter { _.exerciseId === exerciseId }.sortBy(_.id).result }

  def futureUserSolutionNodeForExercise(username: String, exerciseId: Int, nodeId: Int): Future[Option[FlatUserSolutionNode]] =
    db.run { userSolutionNodesTQ.byId(username, exerciseId, nodeId).result.headOption }

  def futureNodesForUserSolution(username: String, exerciseId: Int): Future[Seq[FlatUserSolutionNode]] = db.run {
    userSolutionNodesTQ
      .filter { sol => sol.username === username && sol.exerciseId === exerciseId }
      .sortBy { _.id }
      .result
  }

  protected abstract class SolutionsTable[Node](tag: Tag, tableName: String) extends Table[Node](tag, s"${tableName}_solution_nodes"):
    def exerciseId    = column[Int]("exercise_id")
    def id            = column[Int]("id")
    def childIndex    = column[Int]("child_index")
    def isSubText     = column[Boolean]("is_subtext")
    def text          = column[String]("text")
    def applicability = column[Applicability]("applicability")
    def parentId      = column[Option[Int]]("parent_id")

  protected class SampleSolutionNodesTable(tag: Tag) extends SolutionsTable[FlatSampleSolutionNode](tag, "sample"):
    def pk         = primaryKey("sample_solutions_pk", (exerciseId, id))
    def exerciseFk = foreignKey(s"${tableName}_solution_exercise_fk", exerciseId, exercisesTQ)(_.id, onUpdate = cascade, onDelete = cascade)

    override def * = (exerciseId, id, childIndex, isSubText, text, applicability, parentId).mapTo[FlatSampleSolutionNode]

  protected class UserSolutionNodesTable(tag: Tag) extends SolutionsTable[FlatUserSolutionNode](tag, "user"):
    def username = column[String]("username")

    def pk     = primaryKey("user_solution_pk", (username, exerciseId, id))
    def userFk = foreignKey("user_solution_user_fk", username, userSolutionsTQ)(_.username, onUpdate = cascade, onDelete = cascade)

    override def * = (username, exerciseId, id, childIndex, isSubText, text, applicability, parentId).mapTo[FlatUserSolutionNode]
