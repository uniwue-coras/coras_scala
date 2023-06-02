package model.graphql

import model._
import play.api.libs.json.{Format, Json, OFormat}

import scala.annotation.unused

trait JsonFormats {

  protected val annotationInputJsonFormat: OFormat[AnnotationInput] = {
    @unused
    implicit val x0: Format[ErrorType] = ErrorType.jsonFormat

    Json.format
  }

  // noinspection ScalaUnusedSymbol
  private implicit val flatSolutionNodeInputJsonFormat: OFormat[FlatSolutionNodeInput] = Json.format

  protected val graphQLExerciseInputFormat: OFormat[ExerciseInput] = Json.format

  protected val graphQLUserSolutionInputFormat: OFormat[UserSolutionInput] = Json.format

}
