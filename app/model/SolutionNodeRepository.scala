package model

import scala.concurrent.Future

trait SolutionNodeRepository:
  self: TableDefs =>

  import profile.api._

  protected val sampleSolutionNodesTQ = TableQuery[SampleSolutionNodesTable]
  protected val userSolutionNodesTQ   = TableQuery[UserSolutionNodesTable]

  private def sampleSubTreeSelect(exerciseId: Int, userNodeId: Int) = sql"""
with recursive nodes as (
  select *
    from sample_solution_nodes
    where exercise_id = $exerciseId and id = $userNodeId
  union
  select n.*
    from sample_solution_nodes as n
      join nodes on n.exercise_id = nodes.exercise_id and n.parent_id = nodes.id
)
select exercise_id, id, child_index, is_subtext, text, applicability, parent_id from nodes;
  """.as[(Int, Int, Int, Boolean, String, String, Option[Int])]

  private def userSubTreeSelect(exerciseId: Int, username: String, userNodeId: Int) = sql"""
with recursive nodes as (
  select *
    from user_solution_nodes
    where exercise_id = $exerciseId and username = $username and id = $userNodeId
  union
  select n.*
    from user_solution_nodes as n
      join nodes on n.exercise_id = nodes.exercise_id and n.username = nodes.username and n.parent_id = nodes.id
)
select exercise_id, username, id, child_index, is_subtext, text, applicability, parent_id from nodes;
  """.as[(Int, String, Int, Int, Boolean, String, String, Option[Int])]

  // TODO: includes all subTexts!
  def futureAllSampleSolNodesForExercise(exerciseId: Int): Future[Seq[FlatSampleSolutionNode]] = db.run {
    sampleSolutionNodesTQ
      .filter { _.exerciseId === exerciseId }
      .sortBy { _.id }
      .result
  }

  def futureRealSampleSolNodesForExercise(exerciseId: Int): Future[Seq[FlatSampleSolutionNode]] = db.run {
    sampleSolutionNodesTQ
      .filter { node => node.exerciseId === exerciseId && node.isSubText === false }
      .sortBy { _.id }
      .result
  }

  def futureSubTextNodesForSampleSolNode(exerciseId: Int, nodeId: Int): Future[Seq[FlatSampleSolutionNode]] = db.run {
    sampleSolutionNodesTQ.filter { node => node.exerciseId === exerciseId && node.parentId === Some(nodeId) && node.isSubText === true }.result
  }

  def futureSampleSolutionNodeForExercise(exerciseId: Int, nodeId: Int): Future[Option[FlatSampleSolutionNode]] = db.run {
    sampleSolutionNodesTQ
      .filter { node => node.exerciseId === exerciseId && node.id === nodeId }
      .result
      .headOption
  }

  def futureSelectSampleSubTree(exerciseId: Int, sampleNodeId: Int): Future[Seq[FlatSampleSolutionNode]] = for {
    resultRows <- db.run { sampleSubTreeSelect(exerciseId, sampleNodeId) }

    nodes = resultRows
      .map { case (exerciseId, id, childIndex, isSubText, text, applicability, parentId) =>
        FlatSampleSolutionNode(exerciseId, id, childIndex, isSubText, text, Applicability.withName(applicability), parentId)
      }
      .sortBy { _.id }
  } yield nodes

  // TODO: includes all subTexts!
  def futureAllUserSolNodesForUserSolution(username: String, exerciseId: Int): Future[Seq[FlatUserSolutionNode]] = db.run {
    userSolutionNodesTQ
      .filter { node => node.username === username && node.exerciseId === exerciseId }
      .sortBy { _.id }
      .result
  }

  def futureRealUserSolNodesForUserSolution(username: String, exerciseId: Int): Future[Seq[FlatUserSolutionNode]] = db.run {
    userSolutionNodesTQ
      .filter { node => node.username === username && node.exerciseId === exerciseId && node.isSubText === false }
      .sortBy { _.id }
      .result
  }

  def futuresubTextNodesForUserSolNode(username: String, exerciseId: Int, nodeId: Int): Future[Seq[FlatUserSolutionNode]] = db.run {
    userSolutionNodesTQ.filter { node =>
      node.username === username && node.exerciseId === exerciseId && node.parentId === Some(nodeId) && node.isSubText === true
    }.result
  }

  def futureUserSolutionNodeForExercise(username: String, exerciseId: Int, nodeId: Int): Future[Option[FlatUserSolutionNode]] = db.run {
    userSolutionNodesTQ
      .filter { node => node.username === username && node.exerciseId === exerciseId && node.id === nodeId }
      .result
      .headOption
  }

  def futureSelectUserSubTree(username: String, exerciseId: Int, userNodeId: Int): Future[Seq[FlatUserSolutionNode]] = for {
    resultRows <- db.run { userSubTreeSelect(exerciseId, username, userNodeId) }

    nodes = resultRows
      .map { case (exerciseId, username, id, childIndex, isSubText, text, applicability, parentId) =>
        FlatUserSolutionNode(username, exerciseId, id, childIndex, isSubText, text, Applicability.withName(applicability), parentId)
      }
      .sortBy { _.id }
  } yield nodes

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
