package model

import model.enums.{AnnotationImportance, AnnotationType, ErrorType}

trait Annotation {
  def id: Int
  def errorType: ErrorType
  def importance: AnnotationImportance
  def startIndex: Int
  def endIndex: Int
  def text: String
  def annotationType: AnnotationType
}
