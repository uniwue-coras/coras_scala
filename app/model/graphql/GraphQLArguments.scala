package model.graphql

import model.{Applicability, FlatSolutionNodeInput}
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

trait JsonFormats {

  protected val flatSolutionNodeInputJsonFormat: OFormat[FlatSolutionNodeInput] = Json.format

  protected val graphQLExerciseInputFormat: OFormat[GraphQLExerciseInput] = {
    implicit val x0: OFormat[FlatSolutionNodeInput] = flatSolutionNodeInputJsonFormat

    Json.format
  }

}

trait GraphQLArguments extends JsonFormats {

  val exerciseIdArg: Argument[Int] = Argument("exerciseId", IntType)

  val usernameArg: Argument[String] = Argument("username", StringType)

  val oldPasswordArg: Argument[String] = Argument("oldPassword", StringType)

  val passwordArg: Argument[String] = Argument("password", StringType)

  val passwordRepeatArg: Argument[String] = Argument("passwordRepeat", StringType)

  val ltiUuidArgument: Argument[String] = Argument("ltiUuid", StringType)

  // Input object types

  protected val flatSolutionNodeInputType: InputObjectType[FlatSolutionNodeInput] = {
    implicit val x0: EnumType[Applicability] = Applicability.graphQLType

    deriveInputObjectType()
  }

  private val graphQLExerciseInputType: InputObjectType[GraphQLExerciseInput] = {
    implicit val x0: InputObjectType[FlatSolutionNodeInput] = flatSolutionNodeInputType

    deriveInputObjectType[GraphQLExerciseInput]()
  }

  // Arguments

  val exerciseInputArg: Argument[GraphQLExerciseInput] = {
    implicit val x1: OFormat[GraphQLExerciseInput] = graphQLExerciseInputFormat

    Argument("exerciseInput", graphQLExerciseInputType)
  }

  val correctionInputArg: Argument[GraphQLCorrectionInput] = {
    implicit val x: OFormat[GraphQLCorrectionInput] = Json.format

    Argument("correctionInput", deriveInputObjectType[GraphQLCorrectionInput]())
  }

}
