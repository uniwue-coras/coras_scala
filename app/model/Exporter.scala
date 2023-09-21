package model

import de.uniwue.ls6.model.{ExportedData, ExportedExercise, ExportedRelatedWord}
import play.api.libs.json.{Json, OFormat}

import scala.annotation.unused
import scala.concurrent.{ExecutionContext, Future}

trait LeafExportable[T] {
  def exportData: T
}

trait NodeExportable[T] {
  def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[T]
}

object Exporter {

  val jsonFormat: OFormat[ExportedData] = {
    @unused implicit val exportedExerciseJsonFormat: OFormat[ExportedExercise]       = ExportedExercise.jsonFormat
    @unused implicit val exportedRelatedWordJsonFormat: OFormat[ExportedRelatedWord] = ExportedRelatedWord.jsonFormat

    Json.format
  }

  // TODO: load all data and then group?
  def exportFromDb(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedData] = for {
    abbreviations <- tableDefs.futureAllAbbreviations
    abbreviationsMap = abbreviations.map { case Abbreviation(abb, word) => (abb, word) }.toMap

    relatedWordsGroups: Seq[RelatedWordsGroup] <- tableDefs.futureAllRelatedWordGroups
    exportedRelatedWordsGroups = relatedWordsGroups.map { _.content.map(_.exportData) }

    exercises         <- tableDefs.futureAllExercises
    exportedExercises <- Future.traverse(exercises) { _.exportData(tableDefs) }
  } yield ExportedData(abbreviationsMap, exportedRelatedWordsGroups, exportedExercises)

}
