package corasEvaluator

import model.exporting.{ExportedFlatSampleSolutionNode, ExportedUserSolution}
import model.matching.MatchingResult
import model.matching.nodeMatching.{BasicTreeMatcher, SolutionNodeContainer, SolutionNodeContainerTreeBuilder}
import model.matching.wordMatching.WordAnnotator
import model.{DefaultSolutionNodeMatch, MatchStatus, SolutionNodeMatch}

import scala.concurrent.{ExecutionContext, Future}

type ExerciseToEvaluate = (Int, Seq[ExportedFlatSampleSolutionNode], Seq[ExportedUserSolution])

class NodeMatchingEvaluator(wordAnnotator: WordAnnotator, progressMonitor: ProgressMonitor):

  private def evaluateSingleSolution(
    treeMatcher: BasicTreeMatcher,
    goldNodeMatches: Seq[SolutionNodeMatch],
    sampleNodes: Seq[SolutionNodeContainer],
    userNodes: Seq[SolutionNodeContainer]
  )(implicit ec: ExecutionContext): Future[EvalResults] = Future {

    // perform current matching
    val foundNodeMatches: Seq[DefaultSolutionNodeMatch] = treeMatcher.performMatching(sampleNodes, userNodes)

    progressMonitor.updateInitialMatchingProgress()

    // evaluate current matching
    val MatchingResult(
      correctNodeMatches,
      notMatchedSampleMatches,
      notMatchedUserMatches
    ) = NodeMatchMatcher.performMatching(goldNodeMatches, foundNodeMatches)

    progressMonitor.updateMatchingEvaluationProgress()

    // TODO: evaluate falseNeg + falsePos

    val (certainFalseNegativeTexts, fuzzyFalseNegativeTexts) =
      notMatchedSampleMatches.foldLeft((Seq[CertainDebugExplanation](), Seq[FuzzyFalseNegativeDebugExplanation]())) {
        case ((certains, fuzzies), SolutionNodeMatch(sampleNodeId, userNodeId, _, maybeCertainty)) =>
          val sampleText = sampleNodes.find(_.node.id == sampleNodeId).get.text
          val userText   = userNodes.find(_.node.id == userNodeId).get.text

          maybeCertainty match
            case None            => (certains :+ CertainDebugExplanation(sampleNodeId, sampleText, userNodeId, userText), fuzzies)
            case Some(certainty) => (certains, fuzzies :+ FuzzyFalseNegativeDebugExplanation(sampleNodeId, sampleText, userNodeId, userText, certainty))
      }

    val (certainFalsePositiveTexts, fuzzyFalsePositiveTexts) =
      notMatchedUserMatches.foldLeft((Seq[CertainDebugExplanation](), Seq[FuzzyFalsePositiveDebugExplanation]())) {
        case ((certains, fuzzies), DefaultSolutionNodeMatch(sampleNodeId, userNodeId, maybeExplanation)) =>
          val sampleText = sampleNodes.find(_.node.id == sampleNodeId).get.text
          val userText   = userNodes.find(_.node.id == userNodeId).get.text

          maybeExplanation match
            case None              => (certains :+ CertainDebugExplanation(sampleNodeId, sampleText, userNodeId, userText), fuzzies)
            case Some(explanation) => (certains, fuzzies :+ FuzzyFalsePositiveDebugExplanation(sampleNodeId, sampleText, userNodeId, userText, explanation))
      }

    progressMonitor.updateMappingProgress()

    EvalResults(
      truePositiveCount = correctNodeMatches.length,
      foundMatching = foundNodeMatches,
      certainFalsePositiveTexts = certainFalsePositiveTexts,
      fuzzyFalsePositiveTexts = fuzzyFalsePositiveTexts,
      certainFalseNegativeTexts = certainFalseNegativeTexts,
      fuzzyFalseNegativeTexts = fuzzyFalseNegativeTexts
    )
  }

  private def evaluateSolutionsForExercise(
    matcherUnderTest: BasicTreeMatcher,
    exerciseId: Int,
    sampleSolutionNodeContainers: Seq[SolutionNodeContainer],
    userSolutions: Seq[ExportedUserSolution],
    treeBuilder: SolutionNodeContainerTreeBuilder
  )(implicit ec: ExecutionContext) = for {
    result <- Future.traverse(userSolutions) {
      case ExportedUserSolution(username, userSolutionNodes, nodeMatches, _ /* correctionStatus */, _ /* correctionSummary */ ) =>
        // FIXME: subTexts!
        val userSolutionNodeContainers = treeBuilder.buildSolutionTree(userSolutionNodes, subTexts = Seq.empty)

        for {
          numbers <- evaluateSingleSolution(
            matcherUnderTest,
            goldNodeMatches = nodeMatches.filter { _.matchStatus != MatchStatus.Deleted },
            sampleSolutionNodeContainers,
            userSolutionNodeContainers
          )
        } yield username -> numbers
    }
  } yield exerciseId -> result

  def evaluateNodeMatching(
    matcherUnderTest: BasicTreeMatcher,
    exercises: Seq[ExerciseToEvaluate]
  )(implicit ec: ExecutionContext): Future[Seq[(Int, Seq[(String, EvalResults)])]] = {

    val treeBuilder = SolutionNodeContainerTreeBuilder(wordAnnotator)

    Future.traverse(exercises) { (exerciseId, sampleSolution, userSolutions) =>

      // FIXME: subTextNodes!
      val sampleSolutionNodeContainers = treeBuilder.buildSolutionTree(sampleSolution, subTexts = Seq.empty)

      evaluateSolutionsForExercise(matcherUnderTest, exerciseId, sampleSolutionNodeContainers, userSolutions, treeBuilder)
    }

  }
