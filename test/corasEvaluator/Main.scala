package corasEvaluator

import better.files._
import model.exporting.ExportedData
import play.api.libs.json._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext}
import scala.util.Try

object Main {

  private implicit val ec: ExecutionContext              = ExecutionContext.global
  private implicit val jsonFormat: OFormat[ExportedData] = ExportedData.jsonFormat

  private def writeTextsForComparisonToFile(fileName: String, textsForComparison: Seq[TextsForComparison]) = File(fileName)
    .overwrite(
      Json.prettyPrint(
        Json.toJson(textsForComparison)(Writes.seq(TextsForComparison.jsonFormat))
      )
    )

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

    val numbers = nodeMatchingEvaluation.foldLeft(Numbers.zero)(_ + _)

    println(numbers.evaluation)

    writeTextsForComparisonToFile("falsePositives.json", numbers.falsePositiveTexts)

    // TODO: evaluate (future!) annotation generation & write numbers to file!

  }
}
