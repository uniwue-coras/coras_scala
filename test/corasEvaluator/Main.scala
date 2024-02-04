package corasEvaluator

import better.files._
import model.exporting.{ExportedData, ExportedExercise}
import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TestJsonFormats, TreeMatcher}
import model.matching.paragraphMatching.ParagraphOnlyTreeMatcher
import model.matching.wordMatching.WordAnnotator
import model.{DefaultSolutionNodeMatch, SolutionNode}
import play.api.libs.json._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext}

private def exportCurrentDebugMatches(matches: Seq[DefaultSolutionNodeMatch]) =
  implicit val explWrites: Writes[SolutionNodeMatchExplanation] = TestJsonFormats.solutionNodeMatchExplanationWrites
  implicit val matchWrites: Writes[DefaultSolutionNodeMatch] = {
    implicit val solutionNodeWrites: Writes[SolutionNode] = TestJsonFormats.solutionNodeWrites
    Json.writes
  }

  val file = File.home / "Dokumente" / "current_debug_matches.json"

  file.overwrite(Json.asciiStringify(Json.toJson(matches)))

private def timed[T](f: => T): T =
  val startTime = System.currentTimeMillis()

  val result = f

  println(s"Duration: ${(System.currentTimeMillis() - startTime) / 1000}s")

  result

object EvaluationMain:

  // TODO: evaluate (future!) annotation generation
  def main(args: Array[String]): Unit = {
    implicit val ec: ExecutionContext = ExecutionContext.global

    val CliArgs(onlyParagraphMatching) = CliArgsParser.parse(args, CliArgs()).get

    // load data...
    val file = File.home / "uni_nextcloud" / "CorAs" / "export_coras_new_format_2024-01-29.json"

    val jsResult = file.inputStream
      .apply(Json.parse)
      .validate(ExportedData.jsonFormat)

    jsResult match {
      case JsError(errors) => errors.foreach(println)
      case _               => ()
    }

    val ExportedData(abbreviations, relatedWordGroups, exercises) = jsResult.get

    val wordAnnotator = WordAnnotator(abbreviations, relatedWordGroups)

    val exercisesToEvaluate: Seq[ExerciseToEvaluate] = exercises.map { case ExportedExercise(id, _, _, sampleSolutionNodes, userSolutions) =>
      (id, sampleSolutionNodes, userSolutions)
    }

    val progressMonitor = ProgressMonitor(count = exercisesToEvaluate.flatMap(_._3).length)

    // evaluate node matching...

    val matcherUnderTest = if onlyParagraphMatching then ParagraphOnlyTreeMatcher else TreeMatcher

    println("Starting evaluation...")

    val nodeMatchingEvaluation = timed {
      Await.result(
        NodeMatchingEvaluator(matcherUnderTest, wordAnnotator, progressMonitor).evaluateNodeMatching(exercisesToEvaluate),
        Duration.Inf
      )
    }

    println("Evaluation performed, writing results")

    val completeNumbers = nodeMatchingEvaluation
      .flatMap(_._2)
      .map(_._2)
      .foldLeft(EvalNumbers(0, 0, 0, 0, 0))(_ + _)

    println(completeNumbers.evaluation)

  }
