package model.exporting

import model.{Annotation, AnnotationImportance, AnnotationType, ErrorType}

final case class ExportedAnnotation(
  id: Int,
  errorType: ErrorType,
  importance: AnnotationImportance,
  startIndex: Int,
  endIndex: Int,
  text: String,
  annotationType: AnnotationType
) extends Annotation
