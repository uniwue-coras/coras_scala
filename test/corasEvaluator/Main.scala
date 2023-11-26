package corasEvaluator

import better.files._
import model.exporting.ExportedData
import model.matching.nodeMatching.TestJsonFormats
import play.api.libs.json._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext}
import scala.util.Try

object Main {

  private implicit val ec: ExecutionContext = ExecutionContext.global

  private def writeJsonToFile(fileName: String, jsValue: JsValue) = File(fileName).overwrite(Json.prettyPrint(jsValue))

  def main(args: Array[String]): Unit = {
    val CliArgs(dataFile) = CliArgsParser.parse(args, CliArgs()).get

    val path = Try { File(dataFile.replaceFirst("^~", System.getProperty("user.home"))) }.get

    val jsValue = path.inputStream.apply { Json.parse }

    val ExportedData(abbreviations, relatedWordGroups, exercises) = Json.fromJson[ExportedData](jsValue)(ExportedData.jsonFormat).get

    // evaluate node matching...
    val matchingStartTime = System.currentTimeMillis()

    val evaluator = new NodeMatchingEvaluator(abbreviations, relatedWordGroups)

    val nodeMatchingEvaluation = Await.result(
      evaluator.evaluateNodeMatching(exercises),
      Duration.Inf
    )

    println(s"Duration: ${(System.currentTimeMillis() - matchingStartTime) / 1000}s")

    val numbers = nodeMatchingEvaluation.foldLeft(Numbers.zero)(_ + _)

    println(numbers.evaluation)

    writeJsonToFile("falseNegatives.json", Json.toJson(numbers.falseNegativeTexts)(Writes.seq(TestJsonFormats.falseNegativeDebgExplanationJsonWrites)))
    writeJsonToFile("falsePositives.json", Json.toJson(numbers.falsePositiveTexts)(Writes.seq(TestJsonFormats.FalsePositiveDebugExplanationJsonWrites)))

    // TODO: evaluate (future!) annotation generation & write numbers to file!

  }
}
