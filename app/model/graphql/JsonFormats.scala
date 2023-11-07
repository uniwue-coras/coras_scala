package model.graphql

import model.enums.ErrorType
import model.{AnnotationInput, ExerciseInput, FlatSolutionNodeInput, UserSolutionInput}
import play.api.libs.json.{Format, Json, OFormat}

import scala.annotation.unused

trait JsonFormats {

  protected val annotationInputJsonFormat: OFormat[AnnotationInput] = {
    @unused implicit val x0: Format[ErrorType] = ErrorType.jsonFormat

    Json.format
  }

  @unused private implicit val flatSolutionNodeInputJsonFormat: OFormat[FlatSolutionNodeInput] = Json.format

  protected val graphQLExerciseInputFormat: OFormat[ExerciseInput] = Json.format

  protected val graphQLUserSolutionInputFormat: OFormat[UserSolutionInput] = Json.format

}
