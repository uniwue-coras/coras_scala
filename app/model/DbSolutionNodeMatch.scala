package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{ObjectType, fields, IntType, OptionType, FloatType, Field}

import scala.concurrent.Future

final case class SolutionNodeMatchKey(
  username: String,
  exerciseId: Int
)

final case class DbSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  certainty: Option[Double] = None
)

object SolutionNodeMatchGraphQLTypes extends GraphQLBasics:
  val queryType: ObjectType[GraphQLContext, DbSolutionNodeMatch] = ObjectType(
    "SolutionNodeMatch",
    fields[GraphQLContext, DbSolutionNodeMatch](
      Field("sampleNodeId", IntType, resolve = _.value.sampleNodeId),
      Field("userNodeId", IntType, resolve = _.value.userNodeId),
      Field("matchStatus", MatchStatus.graphQLType, resolve = _.value.matchStatus),
      Field("certainty", OptionType(FloatType), resolve = _.value.certainty)
    )
  )

trait SolutionNodeMatchesRepository:
  self: TableDefs =>

  import profile.api._

  protected object matchesTQ extends TableQuery[MatchesTable](new MatchesTable(_)):
    def forUserNode(username: String, exerciseId: Int, userNodeId: Int) = this.filter { nodeMatch =>
      nodeMatch.username === username && nodeMatch.exerciseId === exerciseId && nodeMatch.userNodeId === userNodeId
    }

    def forSampleNode(exerciseId: Int, sampleNodeId: Int) = this.filter { nodeMatch =>
      nodeMatch.exerciseId === exerciseId && nodeMatch.sampleNodeId === sampleNodeId
    }

  def futureMatchesForUserSolution(username: String, exerciseId: Int): Future[Seq[DbSolutionNodeMatch]] = for {
    matches <- db.run { matchesTQ.filter { m => m.username === username && m.exerciseId === exerciseId }.result }
  } yield matches.map { _._2 }.filter { _.matchStatus != MatchStatus.Deleted }

  def futureInsertMatch(key: SolutionNodeMatchKey, solutionNodeMatch: DbSolutionNodeMatch): Future[Unit] = for {
    _ <- db.run(matchesTQ insertOrUpdate (key, solutionNodeMatch))
  } yield ()

  private def annotationIsForUserNode(annotation: UserSolutionNodeAnnotationsTable, userSolutionNode: UserSolutionNodesTable): Rep[Boolean] =
    annotation.username === userSolutionNode.username && annotation.exerciseId === userSolutionNode.exerciseId && annotation.userNodeId === userSolutionNode.id

  def futureFindOtherCorrectedUserNodes(username: String, exerciseId: Int, userNodeId: Int): Future[Seq[((NodeAnnotationKey, Annotation), String)]] = db.run {
    (for {
      // Find current node
      aMatch <- matchesTQ.forUserNode(username, exerciseId, userNodeId)
      // find matches user solution node
      userSolutionNode <- aMatch.userNodeFk
      // find annotations for user sol node
      annotation <- annotationsTQ if annotationIsForUserNode(annotation, userSolutionNode)

    } yield (annotation, userSolutionNode.text)).result
  }

  def futureSelectUserSolNodesMatchedToSampleSolNode(exerciseId: Int, sampleNodeId: Int): Future[Seq[((NodeAnnotationKey, Annotation), String)]] = db.run {
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

  protected class MatchesTable(tag: Tag)
      extends HasForeignKeyOnUserSolutionNodeTable[(SolutionNodeMatchKey, DbSolutionNodeMatch)](tag, "solution_node_matches"):
    def sampleNodeId   = column[Int]("sample_node_id")
    def matchStatus    = column[MatchStatus]("match_status")
    def maybeCertainty = column[Option[Double]]("maybe_certainty")

    def pk = primaryKey("solution_node_matches_pk", (username, exerciseId, sampleNodeId, userNodeId))
    def sampleEntryFk = foreignKey("sample_node_fk", (exerciseId, sampleNodeId), sampleSolutionNodesTQ)(
      sol => (sol.exerciseId, sol.id),
      onUpdate = cascade,
      onDelete = cascade
    )

    override def * = (
      (username, exerciseId).mapTo[SolutionNodeMatchKey],
      (sampleNodeId, userNodeId, matchStatus, maybeCertainty).mapTo[DbSolutionNodeMatch]
    )
