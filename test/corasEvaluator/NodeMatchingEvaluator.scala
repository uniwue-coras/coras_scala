package corasEvaluator

import model.exporting.{ExportedFlatSampleSolutionNode, ExportedFlatUserSolutionNode, ExportedSolutionNodeMatch, ExportedUserSolution}
import model.matching.MatchingResult
import model.matching.nodeMatching.TreeMatcher
import model.MatchStatus

import scala.concurrent.{ExecutionContext, Future}

type ExerciseToEvaluate = (Int, Seq[ExportedFlatSampleSolutionNode], Seq[ExportedUserSolution])

object NodeMatchingEvaluator:

  private def evaluateSingleSolution(
    progressMonitor: ProgressMonitor,
    treeMatcher: TreeMatcher,
    goldNodeMatches: Seq[ExportedSolutionNodeMatch],
    sampleNodes: Seq[ExportedFlatSampleSolutionNode],
    userNodes: Seq[ExportedFlatUserSolutionNode]
  )(implicit ec: ExecutionContext): Future[Numbers] = Future {

    // perform current matching
    val foundNodeMatches = treeMatcher.performMatching(sampleNodes, userNodes)

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
    matcherUnderTest: TreeMatcher,
    exercises: Seq[ExerciseToEvaluate]
  )(implicit ec: ExecutionContext): Future[Seq[(Int, Seq[Numbers])]] = {
    val progressMonitor = ProgressMonitor(count = exercises.map { _._3.length }.sum)

    Future.traverse(exercises) { (exerciseId, sampleSolution, userSolutions) =>
      for {
        result <- Future.traverse(userSolutions) { (userSolution: ExportedUserSolution) =>
          for {
            numbers <- evaluateSingleSolution(
              progressMonitor,
              matcherUnderTest,
              goldNodeMatches = userSolution.nodeMatches.filter { _.matchStatus != MatchStatus.Deleted },
              sampleSolution,
              userSolution.userSolutionNodes
            )
          } yield numbers
        }
      } yield exerciseId -> result
    }
  }
