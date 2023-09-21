package de.uniwue.ls6.corasEvaluator

import better.files._
import de.uniwue.ls6.corasModel.ExportedExercise
import play.api.libs.json._

object Main {

  private implicit val jsonFormat: OFormat[ExportedExercise] = ExportedExercise.jsonFormat

  def main(args: Array[String]): Unit = {
    if (args.length == 0) {
      System.exit(1)
    }

    val path = File(args(0).replaceFirst("^~", System.getProperty("user.home")))

    if (!path.exists) {
      System.exit(2)
    }

    // stream file?
    val jsValue: JsValue = path.inputStream.apply { Json.parse }

    val exercises = Json.fromJson[Seq[ExportedExercise]](jsValue) match {
      case JsSuccess(value, _) => value
      case JsError(errors) =>
        errors.foreach(println)
        ???
    }

    println(exercises.length)

    System.exit(0)
  }

}
