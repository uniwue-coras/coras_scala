package model.exportModel

import model._
import play.api.libs.json.{Json, OFormat}

final case class ExportedAnnotation(
  id: Int,
  errorType: ErrorType,
  importance: AnnotationImportance,
  startIndex: Int,
  endIndex: Int,
  text: String,
  annotationType: AnnotationType
)

object ExportedAnnotation extends LeafExporter[Annotation, ExportedAnnotation] {

  override def exportData(value: Annotation): ExportedAnnotation = {
    val Annotation(_ /* username */, _ /* exerciseId */, _ /* nodeId */, id, errorType, importance, startIndex, endIndex, text, annotationType) = value

    ExportedAnnotation(id, errorType, importance, startIndex, endIndex, text, annotationType)
  }

  override val jsonFormat: OFormat[ExportedAnnotation] = Json.format

}
