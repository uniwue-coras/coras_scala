package corasEvaluator

import better.files._
import model.exporting.{ExportedData, ExportedExercise, ExportedSolutionNodeMatch, ExportedUserSolution}
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

  val file         = File.home / "uni_nextcloud" / "CorAs" / "export_coras.json"
  val filteredFile = File.home / "uni_nextcloud" / "CorAs" / "export_coras_filtered.json"

  private def filterMultiMatches(nodeMatches: Seq[ExportedSolutionNodeMatch]): Seq[ExportedSolutionNodeMatch] = nodeMatches
    .groupBy { _.sampleNodeId }
    .values
    .map { _.sortBy { _.sampleNodeId }.head }
    .toSeq
    .groupBy { _.userNodeId }
    .values
    .map { _.sortBy { _.userNodeId }.head }
    .toSeq

  end filterMultiMatches

  def filterMultiMatchesInExportedData(exportedData: ExportedData) = exportedData match
    case ExportedData(abbreviations, relatedWordsGroups, exercises) =>
      val filteredExercises = exercises.map { case ExportedExercise(id, title, text, sampleSolutionNodes, userSolutions) =>
        val filteredUserSolutions = userSolutions.map {
          case ExportedUserSolution(username, userSolutionNodes, nodeMatches, correctionStatus, correctionSummary) =>
            val filteredNodeMatches = filterMultiMatches(nodeMatches)

            ExportedUserSolution(username, userSolutionNodes, filteredNodeMatches, correctionStatus, correctionSummary)
        }

        ExportedExercise(id, title, text, sampleSolutionNodes, filteredUserSolutions)
      }

      val filteredExportedData = ExportedData(abbreviations, relatedWordsGroups, filteredExercises)

      val json = Json.toJson(filteredExportedData)(ExportedData.jsonFormat)

      filteredFile.write(Json.prettyPrint(json))

  def doEvaluation(exportedData: ExportedData) =

    val ExportedData(abbreviations, relatedWordGroups, exercises) = exportedData

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
  end doEvaluation

  def main(args: Array[String]): Unit =

    // load data...
    val exportedData = file.inputStream.apply(Json.parse).validate(ExportedData.jsonFormat).get

    if args.length >= 1 && args(0) == "--filter-multi" then filterMultiMatchesInExportedData(exportedData)
    else doEvaluation(exportedData)

  end main
