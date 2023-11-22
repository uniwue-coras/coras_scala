package model.graphql

import model.{AnnotationInput, ErrorType, ExerciseInput, FlatSolutionNodeInput, UserSolutionInput}
import play.api.libs.json.{Format, Json, OFormat}

trait JsonFormats:
  protected val annotationInputJsonFormat: OFormat[AnnotationInput] = {
    implicit val x0: Format[ErrorType] = ErrorType.jsonFormat

    Json.format
  }

  private implicit val flatSolutionNodeInputJsonFormat: OFormat[FlatSolutionNodeInput] = Json.format

  protected val graphQLExerciseInputFormat: OFormat[ExerciseInput] = Json.format

  protected val graphQLUserSolutionInputFormat: OFormat[UserSolutionInput] = Json.format
