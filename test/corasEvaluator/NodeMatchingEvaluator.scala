package corasEvaluator

import model.exporting.{ExportedFlatSampleSolutionNode, ExportedUserSolution}
import model.matching.MatchingResult
import model.matching.nodeMatching.BasicTreeMatcher
import model.matching.wordMatching.WordAnnotator
import model.{MatchStatus, SolutionNodeMatch, SolutionTree}

import scala.concurrent.{ExecutionContext, Future}

type ExerciseToEvaluate = (Int, Seq[ExportedFlatSampleSolutionNode], Seq[ExportedUserSolution])

class NodeMatchingEvaluator(
  matcherUnderTest: BasicTreeMatcher,
  wordAnnotator: WordAnnotator,
  progressMonitor: ProgressMonitor
):

  private type SolResult = (String, EvalNumbers)
  private type ExResult  = (Int, Seq[SolResult])

  private def evaluateSingleSolution(
    goldNodeMatches: Seq[SolutionNodeMatch],
    sampleNodes: SolutionTree,
    userNodes: SolutionTree
  ): EvalNumbers = {

    // perform current matching
    val foundNodeMatches = matcherUnderTest.performMatching(sampleNodes, userNodes)

    // evaluate current matching against gold standard
    val MatchingResult(
      correctNodeMatches,
      notMatchedSampleMatches,
      notMatchedUserMatches
    ) = NodeMatchMatcher.performMatching(goldNodeMatches, foundNodeMatches)

    val certainFalsePosCount = notMatchedSampleMatches.count { _.certainty.isEmpty }
    val certainFalseNegCount = notMatchedUserMatches.count { _.certainty.isEmpty }

    progressMonitor.updateMappingProgress()

    EvalNumbers(
      truePosCount = correctNodeMatches.length,
      certainFalsePosCount = certainFalsePosCount,
      fuzzyFalsePosCount = notMatchedSampleMatches.length - certainFalsePosCount,
      certainFalseNegCount = certainFalseNegCount,
      fuzzyFalseNegCount = notMatchedUserMatches.length - certainFalseNegCount
    )
  }

  private def evaluateSolutionsForExercise(
    sampleNodes: SolutionTree,
    userSolutions: Seq[ExportedUserSolution]
  )(implicit ec: ExecutionContext): Future[Seq[SolResult]] = Future.traverse(userSolutions) {
    case ExportedUserSolution(username, userSolutionNodes, nodeMatches, _, _) =>
      for {
        numbers <- Future {
          evaluateSingleSolution(
            goldNodeMatches = nodeMatches.filter { _.matchStatus != MatchStatus.Deleted },
            sampleNodes = sampleNodes,
            userNodes = SolutionTree.buildFrom(wordAnnotator, userSolutionNodes, Seq.empty)
          )
        }
      } yield username -> numbers
  }

  def evaluateNodeMatching(
    exercises: Seq[ExerciseToEvaluate]
  )(implicit ec: ExecutionContext): Future[Seq[ExResult]] = Future.traverse(exercises) { (exerciseId, sampleSolution, userSolutions) =>

    val sampleSolutionTree = EvaluationTreeBuilder(wordAnnotator).buildSolutionTree(sampleSolution)

    for {
      exerciseResult <- evaluateSolutionsForExercise(sampleSolutionTree, userSolutions)
    } yield exerciseId -> exerciseResult
  }
