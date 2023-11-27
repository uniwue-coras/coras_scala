package corasEvaluator

import better.files._
import model.exporting.ExportedData
import play.api.libs.json._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext}
import scala.util.Try

object Main:

  private implicit val ec: ExecutionContext = ExecutionContext.global

  private implicit val exportedDataJsonFormat: OFormat[ExportedData]                        = ExportedData.jsonFormat
  private implicit val falseNegDebugWrites: Writes[FuzzyFalseNegativeDebugExplanation]      = DebugExplanations.falseNegativeDebugExplanationJsonWrites
  private implicit val certiainFalsePosDebugWrites: Writes[CertainDebugExplanation]         = DebugExplanations.certainDebugExplanationJsonWrites
  private implicit val fuzzyFalsePosDebugWrites: Writes[FuzzyFalsePositiveDebugExplanation] = DebugExplanations.fuzzyFalsePositiveDebugExplanationJsonWrites

  private def writeJsonToFile(file: File, jsValue: JsValue) = file.createFileIfNotExists(createParents = true).overwrite(Json.prettyPrint(jsValue))

  def main(args: Array[String]): Unit = {
    val CliArgs(dataFile) = CliArgsParser.parse(args, CliArgs()).get

    val path = Try { File(dataFile.replaceFirst("^~", System.getProperty("user.home"))) }.get

    val jsValue = path.inputStream.apply { Json.parse }

    val ExportedData(abbreviations, relatedWordGroups, exercises) = Json.fromJson[ExportedData](jsValue).get

    // evaluate node matching...
    val matchingStartTime = System.currentTimeMillis()

    val evaluator = new NodeMatchingEvaluator(abbreviations, relatedWordGroups)

    val nodeMatchingEvaluation = Await.result(
      evaluator.evaluateNodeMatching(exercises),
      Duration.Inf
    )

    println(s"Duration: ${(System.currentTimeMillis() - matchingStartTime) / 1000}s")

    // TODO: evaluate (future!) annotation generation

    for (exerciseId, numbersForUsers) <- nodeMatchingEvaluation do
      val exerciseFolder = file"debug" / exerciseId.toString()

      println(s"Results for exercise $exerciseId")

      for (username, numbers) <- numbersForUsers do

        // val numbers = nodeMatchingEvaluation.foldLeft(Numbers.zero)(_ + _)

        println(s"\t\t$username -> " + numbers.evaluation)

        val fileContent = Json.obj(
          "certainFalseNegatives" -> numbers.certainFalseNegativeTexts,
          "fuzzyFalseNegatives"   -> numbers.fuzzyFalseNegativeTexts,
          "certainFalsePositives" -> numbers.certainFalsePositiveTexts,
          "fuzzyFalsePositives"   -> numbers.fuzzyFalsePositiveTexts
        )

        writeJsonToFile(exerciseFolder / s"$username.json", fileContent)

  }
