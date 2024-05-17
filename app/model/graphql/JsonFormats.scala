package model.graphql

import model.userSolution.UserSolutionInput
import model.{AnnotationInput, ErrorType, ExerciseInput, SolutionNodeInput}
import play.api.libs.json.{Format, Json, OFormat}

trait JsonFormats {
  protected val annotationInputJsonFormat: OFormat[AnnotationInput] = {
    implicit val x0: Format[ErrorType] = ErrorType.jsonFormat

    Json.format
  }

  private implicit val solutionNodeInputJsonFormat: OFormat[SolutionNodeInput] = Json.format

  protected val graphQLExerciseInputFormat: OFormat[ExerciseInput] = Json.format

  protected val graphQLUserSolutionInputFormat: OFormat[UserSolutionInput] = Json.format
}
