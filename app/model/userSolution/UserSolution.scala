package model.userSolution

import model._
import model.matching.{SpacyWordAnnotator}
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}
import model.matching.nodeMatching.TreeMatcher

final case class UserSolution(
  username: String,
  exerciseId: Int,
  correctionFinished: Boolean = false,
  reviewUuid: Option[String] = None
) {
  def dbKey = UserSolutionKey(exerciseId, username)
}

object UserSolution {
  def correct(
    userSolutionNodes: Seq[UserSolutionNode],
    ws: WSClient,
    tableDefs: TableDefs,
    exerciseId: Int,
    username: String
  )(implicit ec: ExecutionContext): Future[Seq[GeneratedSolutionNodeMatch]] = for {
    abbreviations       <- tableDefs.futureAllAbbreviationsAsMap
    relatedWordGroups   <- tableDefs.futureAllRelatedWordGroups
    sampleSolutionNodes <- tableDefs.futureAllSampleSolNodesForExercise(exerciseId)

    wordAnnotator = new SpacyWordAnnotator(ws, abbreviations, relatedWordGroups.map { _.content })

    sampleSolutionTree <- wordAnnotator.buildSampleSolutionTree(sampleSolutionNodes)
    userSolutionTree   <- wordAnnotator.buildUserSolutionTree(userSolutionNodes)

    generatedMatches = TreeMatcher
      .matchContainerTrees(sampleSolutionTree, userSolutionTree)
      .matches
      .map { m => GeneratedSolutionNodeMatch.fromSolutionNodeMatch(exerciseId, username, m)(sampleSolutionTree, userSolutionTree) }
      .sortBy { _.sampleNodeId }
  } yield generatedMatches
}
