package model

final case class UserSubTextNodeAnnotation(
  username: String,
  exerciseId: Int,
  parentNodeId: Int,
  subTextNodeId: Int,
  id: Int,
  errorType: ErrorType,
  importance: AnnotationImportance,
  startIndex: Int,
  endIndex: Int,
  text: String,
  annotationType: AnnotationType
) extends Annotation
