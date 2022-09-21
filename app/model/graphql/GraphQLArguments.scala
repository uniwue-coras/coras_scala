package model.graphql

import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.deriveInputObjectType
import sangria.marshalling.playJson._
import sangria.schema._

final case class GraphQLExerciseInput(
  title: String,
  text: String,
  sampleSolutionAsJson: String
)

final case class GraphQLUserSolutionInput(
  maybeUsername: Option[String],
  solutionAsJson: String
)

final case class GraphQLCorrectionInput(
  username: String,
  correctionAsJson: String
)

trait GraphQLArguments {

  val exerciseIdArg: Argument[Int] = Argument("exerciseId", IntType)

  val usernameArg: Argument[String] = Argument("username", StringType)

  val oldPasswordArg: Argument[String] = Argument("oldPassword", StringType)

  val passwordArg: Argument[String] = Argument("password", StringType)

  val passwordRepeatArg: Argument[String] = Argument("passwordRepeat", StringType)

  val ltiUuidArgument: Argument[String] = Argument("ltiUuid", StringType)

  val exerciseInputArg: Argument[GraphQLExerciseInput] = {
    implicit val x: OFormat[GraphQLExerciseInput] = Json.format

    Argument("exerciseInput", deriveInputObjectType[GraphQLExerciseInput]())
  }

  val userSolutionInputArg: Argument[GraphQLUserSolutionInput] = {
    implicit val x: OFormat[GraphQLUserSolutionInput] = Json.format

    Argument("userSolution", deriveInputObjectType[GraphQLUserSolutionInput]())
  }

  val correctionInputArg: Argument[GraphQLCorrectionInput] = {
    implicit val x: OFormat[GraphQLCorrectionInput] = Json.format

    Argument("correctionInput", deriveInputObjectType[GraphQLCorrectionInput]())
  }

}
