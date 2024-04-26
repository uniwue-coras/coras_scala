package corasEvaluator

import model.exporting.{ExportedFlatSampleSolutionNode, ExportedSolutionNodeMatch, ExportedUserSolution}
import model.matching.nodeMatching.{AnnotatedSampleSolutionTree, AnnotatedUserSolutionTree, TreeMatcher}
import model.matching.{MatchingResult, WordAnnotator}
import model.{GeneratedSolutionNodeMatch, MatchStatus}

import scala.concurrent.{ExecutionContext, Future}

type ExerciseToEvaluate = (Int, Seq[ExportedFlatSampleSolutionNode], Seq[ExportedUserSolution])

object NodeMatchingEvaluator:

  private def evaluateSingleSolution(
    progressMonitor: ProgressMonitor,
    goldNodeMatches: Seq[ExportedSolutionNodeMatch],
    sampleNodes: AnnotatedSampleSolutionTree,
    userNodes: AnnotatedUserSolutionTree
  )(using ExecutionContext): Future[Numbers] = Future {

    // perform current matching
    val foundNodeMatches = TreeMatcher
      .matchContainerTrees(sampleNodes, userNodes)
      .matches
      .map { m => GeneratedSolutionNodeMatch.fromSolutionNodeMatch(m)(using sampleNodes, userNodes) }
      .sortBy { _.sampleNodeId }

    // evaluate current matching
    val MatchingResult(
      correctNodeMatches,
      notMatchedSampleMatches,
      notMatchedUserMatches
    ) = NodeMatchMatcher.performMatching(goldNodeMatches, foundNodeMatches)

    progressMonitor.updateMappingProgress()

    Numbers(
      truePositiveCount = correctNodeMatches.length,
      falsePositiveCount = notMatchedUserMatches.length,
      falseNegativeCount = notMatchedSampleMatches.length
    )
  }

  def evaluateNodeMatching(
    wordAnnotator: WordAnnotator,
    exercises: Seq[ExerciseToEvaluate]
  )(implicit ec: ExecutionContext): Future[Seq[(Int, Seq[Numbers])]] = {
    val progressMonitor = ProgressMonitor(count = exercises.map { _._3.length }.sum)

    Future.traverse(exercises) { (exerciseId, sampleSolution, userSolutions) =>
      for {
        sampleSolutionTree <- wordAnnotator.buildSampleSolutionTree(sampleSolution)
        result <- Future.traverse(userSolutions) { userSolution =>
          for {
            userSolutionTree <- wordAnnotator.buildUserSolutionTree(userSolution.userSolutionNodes)
            numbers <- evaluateSingleSolution(
              progressMonitor,
              goldNodeMatches = userSolution.nodeMatches.filter { _.matchStatus != MatchStatus.Deleted },
              sampleSolutionTree,
              userSolutionTree
            )
          } yield numbers
        }
      } yield exerciseId -> result
    }
  }
