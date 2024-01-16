package corasEvaluator

import better.files._
import model.DefaultSolutionNodeMatch
import model.exporting.{ExportedData, ExportedExercise}
import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TestJsonFormats, TreeMatcher}
import model.matching.paragraphMatching.ParagraphOnlyTreeMatcher
import play.api.libs.json._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext}

private def exportCurrentDebugMatches(matches: Seq[DefaultSolutionNodeMatch]) =
  implicit val explWrites: Writes[SolutionNodeMatchExplanation] = TestJsonFormats.solutionNodeMatchExplanationWrites
  implicit val matchWrites: Writes[DefaultSolutionNodeMatch]    = Json.writes

  val file = File.home / "Dokumente" / "current_debug_matches.json"

  file.overwrite(Json.asciiStringify(Json.toJson(matches)))

private def timed[T](f: => T): T =
  val startTime = System.currentTimeMillis()

  val result = f

  println(s"Duration: ${(System.currentTimeMillis() - startTime) / 1000}s")

  result

object EvaluationMain:

  // json writes
  private implicit val falseNegDebugWrites: Writes[FuzzyFalseNegativeDebugExplanation]      = DebugExplanations.falseNegativeDebugExplanationJsonWrites
  private implicit val certiainFalsePosDebugWrites: Writes[CertainDebugExplanation]         = DebugExplanations.certainDebugExplanationJsonWrites
  private implicit val fuzzyFalsePosDebugWrites: Writes[FuzzyFalsePositiveDebugExplanation] = DebugExplanations.fuzzyFalsePositiveDebugExplanationJsonWrites

  private def writeJsonToFile(file: File)(jsValue: JsValue) = file.createFileIfNotExists(createParents = true).overwrite(Json.prettyPrint(jsValue))

  // TODO: evaluate (future!) annotation generation
  def main(args: Array[String]): Unit = {
    implicit val ec: ExecutionContext = ExecutionContext.global

    val CliArgs(
      onlyParagraphMatching,
      printIndividualNumbers,
      printProgress,
      writeIndividualFiles
    ) = CliArgsParser.parse(args, CliArgs()).get

    // load data...
    val file = File.home / "uni_nextcloud" / "CorAs" / "export_coras_new_format.json"

    val ExportedData(abbreviations, relatedWordGroups, exercises) = file.inputStream.apply(Json.parse).validate(ExportedData.jsonFormat).get

    val exercisesToEvaluate: Seq[ExerciseToEvaluate] = exercises.map { case ExportedExercise(id, _, _, sampleSolutionNodes, userSolutions) =>
      (id, sampleSolutionNodes, userSolutions)
    }

    val count = exercisesToEvaluate.flatMap(_._3).length

    val progressMonitor = ProgressMonitor(printProgress, count)

    // evaluate node matching...

    val matcherUnderTest: TreeMatcher = if onlyParagraphMatching then ParagraphOnlyTreeMatcher else TreeMatcher()

    // TODO: change out matcher!

    val nodeMatchingEvaluation = timed {
      Await.result(
        NodeMatchingEvaluator(progressMonitor).evaluateNodeMatching(matcherUnderTest, exercisesToEvaluate),
        Duration.Inf
      )
    }

    println("Evaluation performed, writing results")

    // write results
    if printIndividualNumbers || writeIndividualFiles then
      for {
        (exerciseId, numbersForUsers) <- nodeMatchingEvaluation
        exerciseFolder = file"debug" / exerciseId.toString()
        (username, evalResult) <- numbersForUsers
      } do

        if printIndividualNumbers then println(s"$exerciseId -> $username -> " + evalResult.numbers)

        if writeIndividualFiles then
          writeJsonToFile(exerciseFolder / s"$username.json") {
            Json.obj(
              "certainFalseNegatives" -> evalResult.certainFalseNegativeTexts,
              "fuzzyFalseNegatives"   -> evalResult.fuzzyFalseNegativeTexts,
              "certainFalsePositives" -> evalResult.certainFalsePositiveTexts,
              "fuzzyFalsePositives"   -> evalResult.fuzzyFalsePositiveTexts
            )
          }
        end if
      end for
    end if

    val completeNumbers = nodeMatchingEvaluation
      .flatMap(_._2)
      .map(_._2.numbers)
      .foldLeft(Numbers(0, 0, 0))(_ + _)

    println(completeNumbers.evaluation)

  }
