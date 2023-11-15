package de.uniwue.ls6.corasEvaluator

import better.files._
import model.exporting.ExportedData
import play.api.libs.json._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext}
import scala.util.Try

final case class Numbers(tp: Int = 0, fp: Int = 0, fn: Int = 0) {

  lazy val precision: Double = (tp.toDouble / (tp + fp).toDouble * 100.0).toInt / 100.0

  lazy val recall: Double = (tp.toDouble / (tp + fn).toDouble * 100.0).toInt / 100.0

  lazy val f1: Double = ((2 * tp) / (2 * tp + fp + fn).toDouble * 100.0).toInt / 100.0

  def evaluation: String = s"Precision: ${precision}%, Recall: ${recall}%, F1: ${f1} (TruePos: $tp / FalsePos: $fp / FalseNeg: $fn)"

}

object Main {

  private implicit val ec: ExecutionContext              = ExecutionContext.global
  private implicit val jsonFormat: OFormat[ExportedData] = ExportedData.jsonFormat

  /*
  private def writeNodeMatchingEvaluationFile(nodeMatchingEvaluation: Seq[EvalResult]) = {
    val file = File("nodeMatchingEvaluation.csv")

    file < "exerciseId,username,correct,missing,wrong\n"

    for (EvalResult(exerciseId, username, correct, missing, wrong) <- nodeMatchingEvaluation) {
      file << s"$exerciseId,$username,$correct,$missing,$wrong"
    }
  }
   */

  private def countNumbers(results: Seq[EvalResult]): Numbers = results.foldLeft(Numbers()) {
    case (Numbers(tp, fp, fn), EvalResult(_, _, truePos, falseNeg, falsePos)) => Numbers(tp + truePos, fp + falsePos, fn + falseNeg)
  }

  def main(args: Array[String]): Unit = {
    val CliArgs(dataFile) = CliArgsParser.parse(args, CliArgs()).get

    val path = Try { File(dataFile.replaceFirst("^~", System.getProperty("user.home"))) }.get

    val jsValue = path.inputStream.apply { Json.parse }

    val ExportedData(abbreviations, relatedWordGroups, exercises) = Json.fromJson[ExportedData](jsValue).get

    // evaluate node matching...
    val matchingStartTime = System.currentTimeMillis()

    val nodeMatchingEvaluation = Await.result(
      NodeMatchingEvaluator.evaluateNodeMatching(abbreviations, relatedWordGroups, exercises),
      Duration.Inf
    )

    println(s"Duration: ${(System.currentTimeMillis() - matchingStartTime) / 1000}s")

    val numbers = countNumbers(nodeMatchingEvaluation)

    println(numbers.evaluation)

    // TODO: evaluate (future!) annotation generation & write numbers to file!

  }
}
