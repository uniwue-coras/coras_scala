package model.exporting

import model.{Abbreviation, TableDefs}

import scala.concurrent.{ExecutionContext, Future}

trait LeafExportable[T]:
  def exportData: T

trait NodeExportable[T]:
  def exportData(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[T]

def exportFromDb(tableDefs: TableDefs)(implicit ec: ExecutionContext): Future[ExportedData] = for {
  abbreviations <- tableDefs.futureAllAbbreviations
  abbreviationsMap = abbreviations.map { case Abbreviation(abb, word) => (abb, word) }.toMap

  relatedWordsGroups <- tableDefs.futureAllRelatedWordGroups
  exportedRelatedWordsGroups = relatedWordsGroups.map { _.content.map(_.exportData) }

  exercises         <- tableDefs.futureAllExercises
  exportedExercises <- Future.traverse(exercises) { _.exportData(tableDefs) }
} yield ExportedData(abbreviationsMap, exportedRelatedWordsGroups, exportedExercises)
