package model.graphql

import model.{AnnotationInput, ExerciseInput, UserSolutionInput}
import play.api.libs.json.OFormat
import sangria.marshalling.playJson._
import sangria.schema._

object GraphQLArguments extends JsonFormats {

  val exerciseIdArg: Argument[Int]                     = Argument("exerciseId", IntType)
  val userSolutionNodeIdArgument: Argument[Int]        = Argument("userSolutionNodeId", IntType)
  val sampleSolutionNodeIdArgument: Argument[Int]      = Argument("sampleSolutionNodeId", IntType)
  val annotationIdArgument: Argument[Int]              = Argument("annotationId", IntType)
  val maybeAnnotationIdArgument: Argument[Option[Int]] = Argument("maybeAnnotationId", OptionInputType(IntType))

  val usernameArg: Argument[String]       = Argument("username", StringType)
  val oldPasswordArg: Argument[String]    = Argument("oldPassword", StringType)
  val passwordArg: Argument[String]       = Argument("password", StringType)
  val passwordRepeatArg: Argument[String] = Argument("passwordRepeat", StringType)
  val ltiUuidArgument: Argument[String]   = Argument("ltiUuid", StringType)

  val annotationArgument: Argument[AnnotationInput] = {
    implicit val x0: OFormat[AnnotationInput] = annotationInputJsonFormat

    Argument("annotation", AnnotationGraphQLTypes.annotationInputType)
  }

  val exerciseInputArg: Argument[ExerciseInput] = {
    implicit val x0: OFormat[ExerciseInput] = graphQLExerciseInputFormat

    Argument("exerciseInput", ExerciseGraphQLTypes.graphQLExerciseInputType)
  }

  val userSolutionInputArg: Argument[UserSolutionInput] = {
    implicit val x0: OFormat[UserSolutionInput] = graphQLUserSolutionInputFormat

    Argument("userSolution", UserSolutionGraphQLTypes.inputType)
  }

}
