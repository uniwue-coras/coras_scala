package model.exportModel

import model.{Exercise, FlatSampleSolutionNode, TableDefs}
import play.api.libs.json.{Json, OFormat}

import scala.annotation.unused
import scala.concurrent.{ExecutionContext, Future}

final case class ExportedExercise(
  id: Int,
  title: String,
  text: String,
  sampleSolutionNodes: Seq[FlatSampleSolutionNode],
  userSolutions: Seq[ExportedUserSolution]
)

object ExportedExercise extends NodeExporter[Exercise, ExportedExercise] {

  override def exportData(exercise: Exercise, tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedExercise] = {
    val Exercise(exerciseId, title, text) = exercise

    for {
      sampleSolutionNodes <- tableDefs.futureSampleSolutionForExercise(exerciseId)

      userSolutionNodes <- tableDefs.futureUserSolutionsForExercise(exerciseId)

      exportedUserSolutions <- Future.traverse(userSolutionNodes) { userSolution => ExportedUserSolution.exportData(userSolution, tableDefs) }

    } yield ExportedExercise(exerciseId, title, text, sampleSolutionNodes, exportedUserSolutions)
  }

  override val jsonFormat: OFormat[ExportedExercise] = {
    @unused implicit val sampleSolutionNodeJsonFormat: OFormat[FlatSampleSolutionNode] = Json.format
    @unused implicit val exportedUserSolutionJsonFormat: OFormat[ExportedUserSolution] = ExportedUserSolution.jsonFormat

    Json.format
  }

}
