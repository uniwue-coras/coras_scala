package corasEvaluator

import model.MatchStatus
import model.exporting.{ExportedFlatSampleSolutionNode, ExportedSolutionNodeMatch, ExportedUserSolution}
import model.matching.nodeMatching.{SolutionTree, TreeMatcher}
import model.matching.{MatchingResult, WordAnnotator}

import scala.concurrent.{ExecutionContext, Future}

type ExerciseToEvaluate = (Int, Seq[ExportedFlatSampleSolutionNode], Seq[ExportedUserSolution])

object NodeMatchingEvaluator:

  private def evaluateSingleSolution(
    progressMonitor: ProgressMonitor,
    goldNodeMatches: Seq[ExportedSolutionNodeMatch],
    sampleNodes: SolutionTree,
    userNodes: SolutionTree
  )(implicit ec: ExecutionContext): Future[Numbers] = Future {

    // perform current matching
    val foundNodeMatches = TreeMatcher.performMatching(sampleNodes, userNodes)

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

      val sampleSolutionTree = SolutionTree.buildWithAnnotator(wordAnnotator, sampleSolution)

      for {
        result <- Future.traverse(userSolutions) { userSolution =>

          val userSolutionTree = SolutionTree.buildWithAnnotator(wordAnnotator, userSolution.userSolutionNodes)

          for {
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
