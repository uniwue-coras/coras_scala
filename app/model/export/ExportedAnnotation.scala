package model.export

import model.Annotation
import model.enums.{AnnotationImportance, AnnotationType, ErrorType}
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
