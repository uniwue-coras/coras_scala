package model

import model.userSolution.{UserSolutionNode, UserSolutionNodeKey}

import scala.concurrent.Future
import scala.language.postfixOps

trait SolutionNodeRepository {
  self: TableDefs =>

  import profile.api._

  protected val sampleSolutionNodesTQ = TableQuery[SampleSolutionNodesTable]
  protected object userSolutionNodesTQ extends TableQuery[UserSolutionNodesTable](new UserSolutionNodesTable(_)) {
    def byKey(key: UserSolutionNodeKey) = this.filter { userSolNode =>
      userSolNode.username === key.username && userSolNode.exerciseId === key.exerciseId && userSolNode.id === key.id
    }
  }

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
select exercise_id, id, child_index, is_subtext, text, applicability, focus_intensity, parent_id from nodes;
  """.as[(Int, Int, Int, Boolean, String, String, Option[String], Option[Int])]

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
select exercise_id, username, id, child_index, is_subtext, text, applicability, focus_intensity, parent_id from nodes;
  """.as[(Int, String, Int, Int, Boolean, String, String, Option[String], Option[Int])]

  def futureAllSampleSolNodesForExercise(exerciseId: Int): Future[Seq[SampleSolutionNode]] = db.run {
    sampleSolutionNodesTQ filter { _.exerciseId === exerciseId } sortBy { _.id } result
  }

  def futureSubTextNodesForSampleSolNode(exerciseId: Int, nodeId: Int): Future[Seq[SampleSolutionNode]] = db.run {
    sampleSolutionNodesTQ filter { node => node.exerciseId === exerciseId && node.parentId === nodeId && node.isSubText === true } result
  }

  def futureSelectSampleSubTree(exerciseId: Int, sampleNodeId: Int): Future[Seq[SampleSolutionNode]] = for {
    resultRows <- db.run { sampleSubTreeSelect(exerciseId, sampleNodeId) }

    nodes = resultRows
      .map { case (exerciseId, id, childIndex, isSubText, text, applicability, focusIntensity, parentId) =>
        SampleSolutionNode(
          exerciseId,
          id,
          childIndex,
          isSubText,
          text,
          Applicability.withName(applicability),
          focusIntensity.map { Importance.withName },
          parentId
        )
      }
      .sortBy { _.id }
  } yield nodes

  def futureAllUserSolNodesForUserSolution(username: String, exerciseId: Int): Future[Seq[UserSolutionNode]] = db.run {
    userSolutionNodesTQ filter { node => node.username === username && node.exerciseId === exerciseId } sortBy { _.id } result
  }

  def futureUserSolutionNodeForExercise(key: UserSolutionNodeKey): Future[Option[UserSolutionNode]] = db.run {
    userSolutionNodesTQ.byKey { key }.result.headOption
  }

  def futureSelectUserSubTree(username: String, exerciseId: Int, userNodeId: Int): Future[Seq[UserSolutionNode]] = for {
    resultRows <- db.run { userSubTreeSelect(exerciseId, username, userNodeId) }

    nodes = resultRows
      .map { case (exerciseId, username, id, childIndex, isSubText, text, applicability, focusIntensity, parentId) =>
        UserSolutionNode(
          username,
          exerciseId,
          id,
          childIndex,
          isSubText,
          text,
          Applicability.withName(applicability),
          focusIntensity.map { Importance.withName },
          parentId
        )
      }
      .sortBy { _.id }
  } yield nodes

  protected abstract class SolutionsTable[Node](tag: Tag, tableName: String) extends Table[Node](tag, s"${tableName}_solution_nodes") {
    def exerciseId     = column[Int]("exercise_id")
    def id             = column[Int]("id")
    def childIndex     = column[Int]("child_index")
    def isSubText      = column[Boolean]("is_subtext")
    def text           = column[String]("text")
    def applicability  = column[Applicability]("applicability")
    def focusIntensity = column[Option[Importance]]("focus_intensity")
    def parentId       = column[Option[Int]]("parent_id")
  }

  protected class SampleSolutionNodesTable(tag: Tag) extends SolutionsTable[SampleSolutionNode](tag, "sample") {
    def pk         = primaryKey("sample_solutions_pk", (exerciseId, id))
    def exerciseFk = foreignKey(s"${tableName}_solution_exercise_fk", exerciseId, exercisesTQ)(_.id, onUpdate = cascade, onDelete = cascade)

    override def * = (exerciseId, id, childIndex, isSubText, text, applicability, focusIntensity, parentId).mapTo[SampleSolutionNode]
  }

  protected class UserSolutionNodesTable(tag: Tag) extends SolutionsTable[UserSolutionNode](tag, "user") {
    def username = column[String]("username")

    def pk     = primaryKey("user_solution_pk", (username, exerciseId, id))
    def userFk = foreignKey("user_solution_user_fk", username, userSolutionsTQ)(_.username, onUpdate = cascade, onDelete = cascade)

    override def * = (username, exerciseId, id, childIndex, isSubText, text, applicability, focusIntensity, parentId).mapTo[UserSolutionNode]
  }
}
