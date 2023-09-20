package model.exportModel

import model.TableDefs
import play.api.libs.json.{Json, OFormat}

import scala.annotation.unused
import scala.concurrent.{ExecutionContext, Future}

final case class ExportedData(
  exercises: Seq[ExportedExercise]
)

object ExportedData {

  def exportFromDb(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedData] = {
    // TODO: load all data and then group?

    for {
      exercises <- tableDefs.futureAllExercises

      exportedExercises <- Future.traverse(exercises) { ex => ExportedExercise.exportData(ex, tableDefs) }

    } yield ExportedData(exportedExercises)
  }

  val jsonFormat: OFormat[ExportedData] = {
    @unused implicit val exportedExerciseJsonFormat: OFormat[ExportedExercise] = ExportedExercise.jsonFormat

    Json.format
  }

}
