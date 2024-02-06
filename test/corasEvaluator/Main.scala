package corasEvaluator

import better.files._
import model.exporting.{ExportedData, ExportedExercise}
import model.matching.WordAnnotator
import play.api.libs.json._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext}

private def timed[T](f: => T): T =
  val startTime = System.currentTimeMillis()

  val result = f

  println(s"Duration: ${(System.currentTimeMillis() - startTime) / 1000}s")

  result

object Main:

  private implicit val ec: ExecutionContext = ExecutionContext.global

  def main(args: Array[String]): Unit = {
    // load data...
    val file = File.home / "uni_nextcloud" / "CorAs" / "export_coras.json"

    val ExportedData(abbreviations, relatedWordGroups, exercises) = file.inputStream.apply(Json.parse).validate(ExportedData.jsonFormat).get

    val exercisesToEvaluate: Seq[ExerciseToEvaluate] = exercises.map { case ExportedExercise(id, _, _, sampleSolutionNodes, userSolutions) =>
      (id, sampleSolutionNodes, userSolutions)
    }

    // evaluate node matching...
    val wordAnnotator = WordAnnotator(abbreviations, relatedWordGroups)

    // TODO: change out matcher!

    val nodeMatchingEvaluation = timed {
      Await.result(
        NodeMatchingEvaluator.evaluateNodeMatching(wordAnnotator, exercisesToEvaluate),
        Duration.Inf
      )
    }

    println("Evaluation performed, writing results")

    val completeNumbers = nodeMatchingEvaluation
      .flatMap(_._2)
      .foldLeft(Numbers.zero)(_ + _)

    println(completeNumbers.evaluation)

  }
