package model.graphql

import model.{AnnotationInput, FlatSolutionNodeInput}
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.deriveInputObjectType
import sangria.marshalling.playJson._
import sangria.schema._

final case class GraphQLExerciseInput(
  title: String,
  text: String,
  sampleSolution: Seq[FlatSolutionNodeInput]
)

final case class GraphQLUserSolutionInput(
  maybeUsername: Option[String],
  solution: Seq[FlatSolutionNodeInput]
)

final case class GraphQLCorrectionInput(
  username: String,
  @deprecated()
  correctionAsJson: String
)

trait GraphQLArguments extends GraphQLInputObjectTypes with JsonFormats {

  protected val exerciseIdArg: Argument[Int]              = Argument("exerciseId", IntType)
  protected val userSolutionNodeIdArgument: Argument[Int] = Argument("userSolutionNodeId", IntType)

  protected val usernameArg: Argument[String]       = Argument("username", StringType)
  protected val oldPasswordArg: Argument[String]    = Argument("oldPassword", StringType)
  protected val passwordArg: Argument[String]       = Argument("password", StringType)
  protected val passwordRepeatArg: Argument[String] = Argument("passwordRepeat", StringType)
  protected val ltiUuidArgument: Argument[String]   = Argument("ltiUuid", StringType)

  protected val annotationArgument: Argument[AnnotationInput] = {
    implicit val x0: OFormat[AnnotationInput] = annotationInputJsonFormat

    Argument("annotation", annotationInputType)
  }

  protected val exerciseInputArg: Argument[GraphQLExerciseInput] = {
    implicit val x0: OFormat[GraphQLExerciseInput] = graphQLExerciseInputFormat

    Argument("exerciseInput", graphQLExerciseInputType)
  }

  protected val correctionInputArg: Argument[GraphQLCorrectionInput] = {
    implicit val x0: OFormat[GraphQLCorrectionInput] = Json.format

    Argument("correctionInput", deriveInputObjectType[GraphQLCorrectionInput]())
  }

  protected val userSolutionInputArg: Argument[GraphQLUserSolutionInput] = {
    implicit val x0: OFormat[GraphQLUserSolutionInput] = graphQLUserSolutionInputFormat

    Argument("userSolution", graphQLUserSolutionInputType)
  }

}
