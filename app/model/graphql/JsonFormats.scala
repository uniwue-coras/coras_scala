package model.graphql

import model.{AnnotationInput, FlatSolutionNodeInput}
import play.api.libs.json.{Json, OFormat}

trait JsonFormats {

  protected val annotationInputJsonFormat: OFormat[AnnotationInput] = Json.format

  private val flatSolutionNodeInputJsonFormat: OFormat[FlatSolutionNodeInput] = Json.format

  protected val graphQLExerciseInputFormat: OFormat[GraphQLExerciseInput] = {
    // noinspection ScalaUnusedSymbol
    implicit val x0: OFormat[FlatSolutionNodeInput] = flatSolutionNodeInputJsonFormat

    Json.format
  }

  protected val graphQLUserSolutionInputFormat: OFormat[GraphQLUserSolutionInput] = {
    // noinspection ScalaUnusedSymbol
    implicit val x0: OFormat[FlatSolutionNodeInput] = flatSolutionNodeInputJsonFormat

    Json.format
  }

}
