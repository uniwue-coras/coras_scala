package de.uniwue.ls6.model

final case class ExportedData(
  abbreviations: Map[String, String],
  relatedWordsGroups: Seq[Seq[ExportedRelatedWord]],
  exercises: Seq[ExportedExercise]
)
