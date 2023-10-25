package de.uniwue.ls6.corasEvaluator

import better.files._
import better.files.Dsl.SymbolicOperations
import play.api.libs.json._

import de.uniwue.ls6.model.ExportedData

import scala.util.{Try, Failure, Success}
import scala.concurrent.{ExecutionContext, Await}
import scala.concurrent.duration.Duration

object Main {

  private implicit val jsonFormat: OFormat[ExportedData] = ExportedData.jsonFormat

  private def writeNodeMatchingEvaluationFile(nodeMatchingEvaluation: Seq[EvalResult]) = {
    val file = File("nodeMatchingEvaluation.csv")

    file < "exerciseId,username,correct,missing,wrong\n"

    for (EvalResult(exerciseId, username, correct, missing, wrong) <- nodeMatchingEvaluation) {
      file << s"$exerciseId,$username,$correct,$missing,$wrong"
    }
  }

  def main(args: Array[String]): Unit = {
    implicit val ec: ExecutionContext = ExecutionContext.global

    val result = for {
      CliArgs(dataFile) <- CliArgsParser.parse(args, CliArgs()).toRight(new Exception("Could not parse cli args!")).toTry

      path <- Try {
        File(dataFile.replaceFirst("^~", System.getProperty("user.home")))
      }

      jsValue = path.inputStream.apply { Json.parse }

      ExportedData(abbreviations, relatedWordGroups, exercises) <- Json.fromJson[ExportedData](jsValue) match {
        case JsSuccess(value, _) => Success(value)
        case JsError(errors) =>
          errors.foreach(println)
          Failure(new Exception("Could not read JSON!"))
      }

      // evaluate node matching...
      matchingStartTime = System.currentTimeMillis()

      nodeMatchingEvaluation = Await.result(
        NodeMatchingEvaluator.evaluateNodeMatching(abbreviations, relatedWordGroups, exercises),
        Duration.Inf
      )

      _ = println(s"Duration: ${(System.currentTimeMillis() - matchingStartTime) / 1000}s")

      // write node matching evaluation to csv...

      writeStartTime = System.currentTimeMillis()

      _ = writeNodeMatchingEvaluationFile(nodeMatchingEvaluation)

      _ = println(s"Write Duration: ${(System.currentTimeMillis() - writeStartTime) / 1000}s")

      // TODO: evaluate (future!) annotation generation & write numbers to file!

    } yield ()

    result match {
      case Success(())        => sys.exit()
      case Failure(exception) => throw exception
    }
  }
}
