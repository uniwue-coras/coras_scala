package model

import de.uniwue.ls6.corasModel.ExportedExercise

import scala.concurrent.{ExecutionContext, Future}

trait LeafExportable[T] {
  def exportData: T
}

trait NodeExportable[T] {
  def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[T]
}

object Exporter {

  // TODO: load all data and then group?
  def exportFromDb(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[Seq[ExportedExercise]] = for {
    exercises <- tableDefs.futureAllExercises

    exportedExercises <- Future.traverse(exercises) { _.exportData(tableDefs) }
  } yield exportedExercises

}
