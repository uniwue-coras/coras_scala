package model

import model.exporting.{ExportedSolutionNodeMatch, LeafExportable}
import model.graphql.{GraphQLContext, MyQueryType}
import sangria.schema._

import scala.concurrent.Future

final case class DbSolutionNodeMatch(
  username: String,
  exerciseId: Int,
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  certainty: Option[Double] = None
) extends SolutionNodeMatch
    with LeafExportable[ExportedSolutionNodeMatch]:
  override def exportData: ExportedSolutionNodeMatch = ExportedSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, certainty)

object SolutionNodeMatchGraphQLTypes extends MyQueryType[DbSolutionNodeMatch]:
  override val queryType: ObjectType[GraphQLContext, DbSolutionNodeMatch] = ObjectType(
    "SolutionNodeMatch",
    fields[GraphQLContext, DbSolutionNodeMatch](
      Field("username", StringType, resolve = _.value.username),
      Field("exerciseId", IntType, resolve = _.value.exerciseId),
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("matchStatus", MatchStatus.graphQLType, resolve = _.value.matchStatus),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty),
      Field("sampleValue", IntType, resolve = _.value.sampleNodeId, deprecationReason = Some("use sampleNodeId")),
      Field("userValue", IntType, resolve = _.value.userNodeId, deprecationReason = Some("use sampleNodeId!"))
    )
  )

trait SolutionNodeMatchesRepository:
  self: TableDefs =>

  import profile.api._

  protected object matchesTQ extends TableQuery[MatchesTable](new MatchesTable(_)) {
    def forUserNode(username: String, exerciseId: Int, userNodeId: Int): Query[MatchesTable, DbSolutionNodeMatch, Seq] =
      this.filter { m => m.username === username && m.exerciseId === exerciseId && m.userNodeId === userNodeId }

    def forSampleNode(exerciseId: Int, sampleNodeId: Int): Query[MatchesTable, DbSolutionNodeMatch, Seq] =
      this.filter { m => m.exerciseId === exerciseId && m.sampleNodeId === sampleNodeId }
  }

  def futureMatchesForUserSolution(username: String, exerciseId: Int): Future[Seq[DbSolutionNodeMatch]] = for {
    matches <- db.run { matchesTQ.filter { m => m.username === username && m.exerciseId === exerciseId }.result }
  } yield matches.filter { _.matchStatus != MatchStatus.Deleted }

  def futureInsertMatch(solutionNodeMatch: DbSolutionNodeMatch): Future[Unit] = for {
    _ <- db.run(matchesTQ.insertOrUpdate(solutionNodeMatch))
  } yield ()

  private def annotationIsForUserNode(annotation: UserSolutionNodeAnnotationsTable, userSolutionNode: UserSolutionNodesTable): Rep[Boolean] =
    annotation.username === userSolutionNode.username && annotation.exerciseId === userSolutionNode.exerciseId && annotation.userNodeId === userSolutionNode.id

  def futureFindOtherCorrectedUserNodes(username: String, exerciseId: Int, userNodeId: Int): Future[Seq[(DbAnnotation, String)]] = db.run {
    (for {
      // Find current node
      aMatch <- matchesTQ.forUserNode(username, exerciseId, userNodeId)
      // find matches user solution node
      userSolutionNode <- aMatch.userNodeFk
      // find annotations for user sol node
      annotation <- annotationsTQ if annotationIsForUserNode(annotation, userSolutionNode)

    } yield (annotation, userSolutionNode.text)).result
  }

  def futureSelectUserSolNodesMatchedToSampleSolNode(exerciseId: Int, sampleNodeId: Int): Future[Seq[(DbAnnotation, String)]] = db.run {
    (for {
      aMatch <- matchesTQ.forSampleNode(exerciseId, sampleNodeId)

      // find (other) matched user sol nodes
      userSolutionNode <- aMatch.userNodeFk

      // find annotations for user sol nodes
      annotation <- annotationsTQ if annotationIsForUserNode(annotation, userSolutionNode)
    } yield (annotation, userSolutionNode.text)).result
  }

  def futureDeleteMatch(username: String, exerciseId: Int, sampleNodeId: Int, userNodeId: Int): Future[Unit] = for {
    _ <- db.run(
      matchesTQ
        .filter { m => m.username === username && m.exerciseId === exerciseId && m.sampleNodeId === sampleNodeId && m.userNodeId === userNodeId }
        .map(_.matchStatus)
        .update(MatchStatus.Deleted)
    )
  } yield ()

  protected class MatchesTable(tag: Tag) extends HasForeignKeyOnUserSolutionNodeTable[DbSolutionNodeMatch](tag, "solution_node_matches"):
    def sampleNodeId           = column[Int]("sample_node_id")
    def matchStatus            = column[MatchStatus]("match_status")
    private def maybeCertainty = column[Option[Double]]("maybe_certainty")

    def pk = primaryKey("solution_node_matches_pk", (username, exerciseId, sampleNodeId, userNodeId))
    def sampleEntryFk =
      foreignKey("sample_node_fk", (exerciseId, sampleNodeId), sampleSolutionNodesTQ)(sol => (sol.exerciseId, sol.id), onUpdate = cascade, onDelete = cascade)

    override def * = (username, exerciseId, sampleNodeId, userNodeId, matchStatus, maybeCertainty).mapTo[DbSolutionNodeMatch]
