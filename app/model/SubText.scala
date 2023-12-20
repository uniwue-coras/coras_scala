package model

import scala.concurrent.Future

trait SubText:
  def exerciseId: Int
  def nodeId: Int
  def id: Int
  def text: String
  def applicability: Applicability

final case class SampleSubText(
  exerciseId: Int,
  nodeId: Int,
  id: Int,
  text: String,
  applicability: Applicability
) extends SubText

final case class UserSubText(
  username: String,
  exerciseId: Int,
  nodeId: Int,
  id: Int,
  text: String,
  applicability: Applicability
) extends SubText

trait SubTextRepository:
  self: TableDefs =>

  import profile.api._

  private val sampleSubTextsTQ = TableQuery[SampleSubTextTable]
  private val userSubTextsTQ   = TableQuery[UserSubTextTable]

  def futureSubTextsForSampleSolNode(exerciseId: Int, nodeId: Int): Future[Seq[SampleSubText]] = db.run {
    sampleSubTextsTQ.filter { subText => subText.exerciseId === exerciseId && subText.parentNodeId === nodeId }.result
  }

  def futureSubTextsForUserSolNode(username: String, exerciseId: Int, nodeId: Int): Future[Seq[UserSubText]] = db.run {
    userSubTextsTQ.filter { subText => subText.username === username && subText.exerciseId === exerciseId && subText.parentNodeId === nodeId }.result
  }

  protected abstract class SubTextTable[ST <: SubText](tag: Tag, tableName: String) extends Table[ST](tag, tableName):
    def exerciseId    = column[Int]("exercise_id")
    def parentNodeId  = column[Int]("parent_node_id")
    def id            = column[Int]("id")
    def content       = column[String]("content")
    def applicability = column[Applicability]("applicability")

  protected class SampleSubTextTable(tag: Tag) extends SubTextTable[SampleSubText](tag, "sample_solution_sub_text_nodes"):

    def pk = primaryKey("sample_solution_sub_text_nodes_pk", (exerciseId, parentNodeId, id))
    def sample_node_fk = foreignKey("sample_sub_text_node_fk", (exerciseId, parentNodeId), sampleSolutionNodesTQ)(
      (node) => (node.exerciseId, node.id),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * = (exerciseId, parentNodeId, id, content, applicability).mapTo[SampleSubText]

  protected class UserSubTextTable(tag: Tag) extends SubTextTable[UserSubText](tag, "user_solution_sub_text_nodes"):
    def username = column[String]("username")

    def pk = primaryKey("user_solution_sub_text_nodes_pk", (username, exerciseId, parentNodeId, id))
    def user_node_fk = foreignKey("user_sub_text_node_fk", (username, exerciseId, parentNodeId), userSolutionNodesTQ)(
      (node) => (node.username, node.exerciseId, node.id),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * = (username, exerciseId, parentNodeId, id, content, applicability).mapTo[UserSubText]
