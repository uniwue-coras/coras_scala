package corasEvaluator

import better.files._
import model.ExportedRelatedWord
import model.exporting.{ExportedData, ExportedExercise}
import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TestJsonFormats}
import play.api.libs.json._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext}

private def exportCurrentDebugMatches(matches: Seq[EvaluationNodeMatch]) =
  implicit val explWrites: Writes[SolutionNodeMatchExplanation] = TestJsonFormats.solutionNodeMatchExplanationWrites
  implicit val matchWrites: Writes[EvaluationNodeMatch]         = Json.writes

  val file = File.home / "Dokumente" / "current_debug_matches.json"

  file.overwrite(Json.asciiStringify(Json.toJson(matches)))

private def timed[T](f: => T): T =
  val startTime = System.currentTimeMillis()

  val result = f

  println(s"Duration: ${(System.currentTimeMillis() - startTime) / 1000}s")

  result

object Main:

  private implicit val ec: ExecutionContext = ExecutionContext.global

  // json writes
  private implicit val falseNegDebugWrites: Writes[FuzzyFalseNegativeDebugExplanation]      = DebugExplanations.falseNegativeDebugExplanationJsonWrites
  private implicit val certiainFalsePosDebugWrites: Writes[CertainDebugExplanation]         = DebugExplanations.certainDebugExplanationJsonWrites
  private implicit val fuzzyFalsePosDebugWrites: Writes[FuzzyFalsePositiveDebugExplanation] = DebugExplanations.fuzzyFalsePositiveDebugExplanationJsonWrites

  private def writeJsonToFile(file: File, jsValue: JsValue) = file.createFileIfNotExists(createParents = true).overwrite(Json.prettyPrint(jsValue))

  def doEvaluation(
    abbreviations: Map[String, String],
    relatedWordGroups: Seq[Seq[ExportedRelatedWord]],
    evaluationData: Seq[ExerciseToEvaluate]
  ) = {
    // evaluate node matching...
    val matcherUnderTest = EvaluatorTreeMatcher(abbreviations, relatedWordGroups)

    val nodeMatchingEvaluation = timed {
      Await.result(
        NodeMatchingEvaluator.evaluateNodeMatching(matcherUnderTest, evaluationData),
        Duration.Inf
      )
    }

    // write results
    for {
      (exerciseId, numbersForUsers) <- nodeMatchingEvaluation
      exerciseFolder = file"debug" / exerciseId.toString()
      (username, evalResult) <- numbersForUsers
    } do

      val numbers = evalResult.numbers

      println(s"$exerciseId -> $username -> " + numbers)

      val fileContent = Json.obj(
        "certainFalseNegatives" -> evalResult.certainFalseNegativeTexts,
        "fuzzyFalseNegatives"   -> evalResult.fuzzyFalseNegativeTexts,
        "certainFalsePositives" -> evalResult.certainFalsePositiveTexts,
        "fuzzyFalsePositives"   -> evalResult.fuzzyFalsePositiveTexts
      )

      writeJsonToFile(exerciseFolder / s"$username.json", fileContent)

    val completeNumbers = nodeMatchingEvaluation
      .flatMap(_._2)
      .map(_._2.numbers)
      .foldLeft(Numbers(0, 0, 0))(_ + _)

    println(completeNumbers.evaluation)

  }

  // TODO: evaluate (future!) annotation generation
  def main(args: Array[String]): Unit = {

    // load data...
    val ExportedData(abbreviations, relatedWordGroups, exercises) = EvaluationDataLoader.loadData

    val evaluationData = exercises.map { case ExportedExercise(id, _, _, sampleSolution, userSolutions) => (id, sampleSolution, userSolutions) }

    doEvaluation(abbreviations, relatedWordGroups, evaluationData)
  }
