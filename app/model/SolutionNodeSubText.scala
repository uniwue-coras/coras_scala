package model

import scala.concurrent.Future

final case class SolutionNodeSubText(
  id: Int,
  text: String
)

trait SubTextRepository {
  self: TableDefs =>

  import MyPostgresProfile.api._

  protected type DbSubTextRow = (Int, Int, Int, String)

  protected type DbUserSubTextRow = (String, DbSubTextRow)

  private val row2SubText: DbSubTextRow => SolutionNodeSubText = { case (_, _, id, text) => SolutionNodeSubText(id, text) }

  private val subText2Row: (Int, Int, SolutionNodeSubText) => DbSubTextRow = { case (exerciseId, nodeId, SolutionNodeSubText(id, text)) =>
    (exerciseId, nodeId, id, text)
  }

  protected val sampleSubTextsTQ = TableQuery[SampleSubTextTable]

  protected val userSubTextsTQ = TableQuery[UserSubTextRepository]

  def futureSubTextsForSampleSolutionNode(exerciseId: Int, nodeId: Int): Future[Seq[SolutionNodeSubText]] = for {
    rows <- db.run(sampleSubTextsTQ.filter { st => st.exerciseId === exerciseId && st.nodeId === nodeId }.result)
  } yield rows.map(row2SubText)

  def futureSubTextsForUserSolutionNode(username: String, exerciseId: Int, nodeId: Int): Future[Seq[SolutionNodeSubText]] = for {
    rows <- db.run(userSubTextsTQ.filter { st => st.username === username && st.exerciseId === exerciseId && st.nodeId === nodeId }.result)
  } yield rows.map((s) => row2SubText(s._2))

  protected abstract class SubTextTable[ST](tag: Tag, s: String) extends Table[ST](tag, s"${s}_solution_entry_sub_texts") {

    def exerciseId = column[Int]("exercise_id")

    def nodeId = column[Int]("entry_id")

    def id = column[Int]("id")

    def text = column[String]("text")

    def applicability = column[Applicability]("applicability")

  }

  protected class SampleSubTextTable(tag: Tag) extends SubTextTable[DbSubTextRow](tag, "sample") {

    def pk = primaryKey("sample_sub_texts_pk", (exerciseId, nodeId, id))

    // noinspection ScalaUnusedSymbol
    def nodeFk = foreignKey("sample_sub_text_node_fk", (exerciseId, nodeId), sampleSolutionNodesTQ)(
      node => (node.exerciseId, node.id),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (exerciseId, nodeId, id, text)

  }

  protected class UserSubTextRepository(tag: Tag) extends SubTextTable[DbUserSubTextRow](tag, "user") {

    def username = column[String]("username")

    def pk = primaryKey("user_sub_texts_pk", (username, exerciseId, nodeId, id))

    // noinspection ScalaUnusedSymbol
    def nodeFk = foreignKey("user_sub_text_node_fk", (username, exerciseId, nodeId), userSolutionNodesTQ)(
      node => (node.username, node.exerciseId, node.id),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (username, (exerciseId, nodeId, id, text)).shaped

  }

}
