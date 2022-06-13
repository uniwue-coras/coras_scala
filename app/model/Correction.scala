package model

import scala.concurrent.{ExecutionContext, Future}

final case class MatchedSolutionNode(
  id: Int,
  text: String,
  applicability: Applicability
)

final case class NodeCorrectionMatch(
  sampleValue: MatchedSolutionNode,
  userValue: MatchedSolutionNode,
  childMatches: SolutionNodeMatchingResult
)

final case class SolutionNodeMatchingResult(
  matches: Seq[NodeCorrectionMatch],
  notMatchedSample: Seq[SolutionNode],
  notMatchedUser: Seq[SolutionNode]
)

final case class Correction(
  rootMatchingResult: SolutionNodeMatchingResult
)

trait NodeMatchRepo {
  self: TableDefs =>

  import profile.api._

  implicit val ec: ExecutionContext

  protected val solutionNodeMatchesTQ = TableQuery[SolutionNodeMatchesTable]

  def futureInsertNodeMatch(username: String, exerciseId: Int, id: Int, sampleNodeId: Int, userNodeId: Int, parentId: Option[Int]): Future[Boolean] =
    db.run(solutionNodeMatchesTQ += (username, exerciseId, id, sampleNodeId, userNodeId, parentId)).map(_ == 1)

  def loadCorrection(username: String, exerciseId: Int): Future[Any] = {

    val rootNodes = db.run(solutionNodeMatchesTQ.filter(_.parentId.isEmpty).result)

    ???
  }

  protected class SolutionNodeMatchesTable(tag: Tag) extends Table[(String, Int, Int, Int, Int, Option[Int])](tag, "solution_node_matches") {

    def username = column[String]("username")

    def exerciseId = column[Int]("exercise_id")

    def id = column[Int]("id")

    def sampleNodeId = column[Int]("sample_node_id")

    def userNodeId = column[Int]("user_node_id")

    def parentId = column[Option[Int]]("parent_id")

    def pk = primaryKey("solution_node_matches_pk", (username, exerciseId, id))

    def uniqueIndex = index("match_unique", (username, exerciseId, sampleNodeId, userNodeId), unique = true)

    def sampleNodeFk = foreignKey("solution_node_match_sample_node_fk", (exerciseId, sampleNodeId), flatSampleSolutionNodesTableTQ)(
      node => (node.exerciseId, node.id),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    def userNodeFk = foreignKey("solution_node_match_user_node_fk", (username, exerciseId, userNodeId), flatUserSolutionNodesTableTQ)(
      node => (node.username, node.exerciseId, node.id),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    override def * = (username, exerciseId, id, sampleNodeId, userNodeId, parentId)

  }

}
