package de.uniwue.ls6.corasEvaluator

import better.files._
import de.uniwue.ls6.model.ExportedData
import play.api.libs.json._
import scala.util.{Try, Failure, Success}

object Main {

  private implicit val jsonFormat: OFormat[ExportedData] = ExportedData.jsonFormat

  def main(args: Array[String]): Unit = {
    for {
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

      // FIXME: evaluate node matching...
      nodeMatchingEvaluation = NodeMatchingEvaluator.evaluateNodeMatching(abbreviations, relatedWordGroups, exercises)

      _ = println(nodeMatchingEvaluation)

    } yield ()
  }
}
