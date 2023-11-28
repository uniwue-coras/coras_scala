package corasEvaluator

import better.files._
import model.ExportedRelatedWord
import model.exporting.{ExportedFlatSampleSolutionNode, ExportedUserSolution}
import model.matching.nodeMatching.{SolutionNodeMatchExplanation, TestJsonFormats}
import play.api.libs.json._

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext}

private def exportCurrentDebugMatches(matches: Seq[EvaluationNodeMatch]) =
  implicit val explWrites: Writes[SolutionNodeMatchExplanation] = TestJsonFormats.solutionNodeMatchExplanationWrites
  implicit val matchWrites: Writes[EvaluationNodeMatch]         = Json.writes

  val file = File.home / "Dokumente" / "current_debug_matches.json"

  file.overwrite(Json.asciiStringify(Json.toJson(matches)))

private def openAndParseJson[T](file: File)(implicit tReads: Reads[T]): T = Json.fromJson[T](file.inputStream.apply { Json.parse })(tReads).get

private def timed[T](f: => T): T =
  val startTime = System.currentTimeMillis()

  val result = f

  println(s"Duration: ${(System.currentTimeMillis() - startTime) / 1000}s")

  result

object Main:
  private val exerciseFolderRegex = """ex_(\d+)""".r

  private implicit val ec: ExecutionContext = ExecutionContext.global

  // json reads
  private implicit val exportedRelatedWordReads: Reads[ExportedRelatedWord]                       = ExportedRelatedWord.jsonFormat
  private implicit val ExportedFlatSampleSolutionNodeReads: Reads[ExportedFlatSampleSolutionNode] = ExportedFlatSampleSolutionNode.jsonFormat
  private implicit val exportedUserSolutionReads: Reads[ExportedUserSolution]                     = ExportedUserSolution.jsonFormat

  // json writes
  private implicit val falseNegDebugWrites: Writes[FuzzyFalseNegativeDebugExplanation]      = DebugExplanations.falseNegativeDebugExplanationJsonWrites
  private implicit val certiainFalsePosDebugWrites: Writes[CertainDebugExplanation]         = DebugExplanations.certainDebugExplanationJsonWrites
  private implicit val fuzzyFalsePosDebugWrites: Writes[FuzzyFalsePositiveDebugExplanation] = DebugExplanations.fuzzyFalsePositiveDebugExplanationJsonWrites

  private def writeJsonToFile(file: File, jsValue: JsValue) = file.createFileIfNotExists(createParents = true).overwrite(Json.prettyPrint(jsValue))

  private val folder = File.home / "uni_nextcloud" / "CorAs" / "export_coras"

  private def loadExerciseFromFiles(exerciseFolder: File): ExerciseToEvaluate = {
    val dataFileContent: JsObject = openAndParseJson(exerciseFolder / "data.json")

    val exerciseId: Int                                     = (dataFileContent \ "id").validate.get
    val sampleSolution: Seq[ExportedFlatSampleSolutionNode] = (dataFileContent \ "sampleSolutionNodes").validate.get

    val userSolutions = exerciseFolder.children
      .filter(_.name != "data.json")
      .map { openAndParseJson[ExportedUserSolution] }
      .toSeq

    (exerciseId, sampleSolution, userSolutions)
  }

  // TODO: evaluate (future!) annotation generation
  def main(args: Array[String]): Unit = {

    // load data...
    val abbreviations: Map[String, String]               = openAndParseJson(folder / "abbreviations.json")
    val relatedWordGroups: Seq[Seq[ExportedRelatedWord]] = openAndParseJson(folder / "relatedWordGroups.json")
    val evaluationData: Seq[ExerciseToEvaluate]          = folder.globRegex(exerciseFolderRegex).map { loadExerciseFromFiles }.toSeq

    // evaluate node matching...
    val evaluator = new NodeMatchingEvaluator(abbreviations, relatedWordGroups)

    val nodeMatchingEvaluation = timed {
      Await.result(
        evaluator.evaluateNodeMatching(evaluationData),
        Duration.Inf
      )
    }

    // write results
    for {
      (exerciseId, numbersForUsers) <- nodeMatchingEvaluation
      exerciseFolder = file"debug" / exerciseId.toString()
      (username, evalResult) <- numbersForUsers
    } do

      val numbers = evalResult.numbers

      if (exerciseId == 1 && username == "2109371") {
        exportCurrentDebugMatches(evalResult.foundMatching)
      }

      println(s"$exerciseId -> $username -> " + numbers)

      val fileContent = Json.obj(
        "certainFalseNegatives" -> evalResult.certainFalseNegativeTexts,
        "fuzzyFalseNegatives"   -> evalResult.fuzzyFalseNegativeTexts,
        "certainFalsePositives" -> evalResult.certainFalsePositiveTexts,
        "fuzzyFalsePositives"   -> evalResult.fuzzyFalsePositiveTexts
      )

      writeJsonToFile(exerciseFolder / s"$username.json", fileContent)

    val completeNumbers = nodeMatchingEvaluation
      .flatMap(_._2)
      .map(_._2.numbers)
      .foldLeft(Numbers(0, 0, 0))(_ + _)

    println(completeNumbers.evaluation)

  }
