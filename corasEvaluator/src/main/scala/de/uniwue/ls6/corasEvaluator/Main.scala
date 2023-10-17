package de.uniwue.ls6.corasEvaluator

import better.files._
import better.files.Dsl.SymbolicOperations
import de.uniwue.ls6.model.ExportedData
import play.api.libs.json._
import scala.util.{Try, Failure, Success}

object Main {

  private implicit val jsonFormat: OFormat[ExportedData] = ExportedData.jsonFormat

  private def writeNodeMatchingEvaluationFile(nodeMatchingEvaluation: LazyList[EvalResult]) = {
    val file = File("nodeMatchingEvaluation.csv")

    file < "exerciseId,username,correct,missing,wrong\n"

    for (EvalResult(exerciseId, username, correct, missing, wrong) <- nodeMatchingEvaluation) {
      file << s"$exerciseId,$username,$correct,$missing,$wrong"
    }
  }

  def main(args: Array[String]): Unit = {
    val result = for {
      CliArgs(dataFile) <- CliArgsParser.parse(args, CliArgs()).toRight(new Exception("Could not parser cli args!")).toTry

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
      nodeMatchingEvaluation = NodeMatchingEvaluator.evaluateNodeMatching(abbreviations, relatedWordGroups, exercises)

      // TODO: write node matching evaluation to csv...

      _ = writeNodeMatchingEvaluationFile(nodeMatchingEvaluation)

    } yield ()

    result match {
      case Success(())        => sys.exit()
      case Failure(exception) => throw exception
    }
  }
}
