package corasEvaluator

import model.exporting.{ExportedFlatSampleSolutionNode, ExportedUserSolution}
import model.matching.MatchingResult
import model.matching.nodeMatching.{BasicTreeMatcher, SolutionNodeContainer}
import model.matching.wordMatching.WordAnnotator
import model.{DefaultSolutionNodeMatch, MatchStatus, SolutionNodeMatch}

import scala.concurrent.{ExecutionContext, Future}

type ExerciseToEvaluate = (Int, Seq[ExportedFlatSampleSolutionNode], Seq[ExportedUserSolution])

class NodeMatchingEvaluator(wordAnnotator: WordAnnotator, progressMonitor: ProgressMonitor):

  type SolResult = (String, EvalResults)
  type ExResult  = (Int, Seq[SolResult])

  private def evaluateSingleSolution(
    treeMatcher: BasicTreeMatcher,
    goldNodeMatches: Seq[SolutionNodeMatch],
    sampleNodes: Seq[SolutionNodeContainer],
    userNodes: Seq[SolutionNodeContainer]
  )(implicit ec: ExecutionContext): Future[EvalResults] = Future {

    // perform current matching
    val foundNodeMatches: Seq[DefaultSolutionNodeMatch] = treeMatcher.performMatching(sampleNodes, userNodes)

    // evaluate current matching
    val MatchingResult(
      correctNodeMatches,
      notMatchedSampleMatches,
      notMatchedUserMatches
    ) = NodeMatchMatcher.performMatching(goldNodeMatches, foundNodeMatches)

    val (certainFalseNegs, fuzzyFalseNegs)   = notMatchedSampleMatches.partition(_.certainty.isEmpty)
    val (certainFalsePoses, fuzzyFalsePoses) = notMatchedUserMatches.partition(_.certainty.isEmpty)

    progressMonitor.updateMappingProgress()

    EvalResults(
      truePositiveCount = correctNodeMatches.length,
      certainFalsePositiveTexts = certainFalsePoses.length,
      fuzzyFalsePositiveTexts = fuzzyFalsePoses.length,
      certainFalseNegativeTexts = certainFalseNegs.length,
      fuzzyFalseNegativeTexts = fuzzyFalseNegs.length
    )
  }

  private def evaluateSolutionsForExercise(
    matcherUnderTest: BasicTreeMatcher,
    exerciseId: Int,
    sampleSolutionNodeContainers: Seq[SolutionNodeContainer],
    userSolutions: Seq[ExportedUserSolution],
    treeBuilder: EvaluationTreeBuilder
  )(implicit ec: ExecutionContext): Future[ExResult] = for {
    result <- Future.traverse(userSolutions) { case ExportedUserSolution(username, userSolutionNodes, nodeMatches, _, _) =>
      val userSolutionNodeContainers = treeBuilder.buildSolutionTree(userSolutionNodes)

      val goldNodeMatches = nodeMatches.filter { _.matchStatus != MatchStatus.Deleted }

      for {
        numbers <- evaluateSingleSolution(matcherUnderTest, goldNodeMatches, sampleSolutionNodeContainers, userSolutionNodeContainers)
      } yield username -> numbers
    }
  } yield exerciseId -> result

  def evaluateNodeMatching(
    matcherUnderTest: BasicTreeMatcher,
    exercises: Seq[ExerciseToEvaluate]
  )(implicit ec: ExecutionContext): Future[Seq[ExResult]] = {

    val treeBuilder = EvaluationTreeBuilder(wordAnnotator)

    Future.traverse(exercises) { (exerciseId, sampleSolution, userSolutions) =>

      val sampleSolutionNodeContainers = treeBuilder.buildSolutionTree(sampleSolution)

      evaluateSolutionsForExercise(matcherUnderTest, exerciseId, sampleSolutionNodeContainers, userSolutions, treeBuilder)
    }

  }
