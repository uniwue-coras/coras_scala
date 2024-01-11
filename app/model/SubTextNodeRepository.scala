package model

import scala.concurrent.Future

trait SubTextRepository:
  self: TableDefs =>

  import profile.api._

  private val sampleSubTextsTQ = TableQuery[SampleSubTextTable]
  private val userSubTextsTQ   = TableQuery[UserSubTextTable]

  def futureSubTextsForSampleSolNode(exerciseId: Int, nodeId: Int): Future[Seq[SampleSubTextNode]] = db.run {
    sampleSubTextsTQ.filter { subText => subText.exerciseId === exerciseId && subText.parentNodeId === nodeId }.result
  }

  def futureSubTextsForUserSolNode(username: String, exerciseId: Int, nodeId: Int): Future[Seq[UserSubTextNode]] = db.run {
    userSubTextsTQ.filter { subText => subText.username === username && subText.exerciseId === exerciseId && subText.parentNodeId === nodeId }.result
  }

  private abstract class SubTextTable[ST <: SubTextNode](tag: Tag, tableName: String) extends Table[ST](tag, tableName):
    def exerciseId    = column[Int]("exercise_id")
    def parentNodeId  = column[Int]("parent_node_id")
    def id            = column[Int]("id")
    def content       = column[String]("content")
    def applicability = column[Applicability]("applicability")

  private class SampleSubTextTable(tag: Tag) extends SubTextTable[SampleSubTextNode](tag, "sample_solution_sub_text_nodes"):

    def pk = primaryKey("sample_solution_sub_text_nodes_pk", (exerciseId, parentNodeId, id))
    def sample_node_fk = foreignKey("sample_sub_text_node_fk", (exerciseId, parentNodeId), sampleSolutionNodesTQ)(
      (node) => (node.exerciseId, node.id),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * = (exerciseId, parentNodeId, id, content, applicability).mapTo[SampleSubTextNode]

  private class UserSubTextTable(tag: Tag) extends SubTextTable[UserSubTextNode](tag, "user_solution_sub_text_nodes"):
    def username = column[String]("username")

    def pk = primaryKey("user_solution_sub_text_nodes_pk", (username, exerciseId, parentNodeId, id))
    def user_node_fk = foreignKey("user_sub_text_node_fk", (username, exerciseId, parentNodeId), userSolutionNodesTQ)(
      (node) => (node.username, node.exerciseId, node.id),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * = (username, exerciseId, parentNodeId, id, content, applicability).mapTo[UserSubTextNode]
