package de.uniwue.ls6.corasModel

import play.api.libs.json.{Json, OFormat}

final case class ExportedAnnotation(
  id: Int,
  errorType: ErrorType,
  importance: AnnotationImportance,
  startIndex: Int,
  endIndex: Int,
  text: String,
  annotationType: AnnotationType
) extends Annotation

object ExportedAnnotation {

  val jsonFormat: OFormat[ExportedAnnotation] = Json.format

}
