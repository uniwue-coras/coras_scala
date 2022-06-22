package model.graphql

import model._
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.{deriveInputObjectType, deriveObjectType}
import sangria.marshalling.playJson._
import sangria.schema._

final case class RegisterInput(
  username: String,
  password: String,
  passwordRepeat: String
)
final case class LoginInput(
  username: String,
  password: String
)

final case class LoginResult(
  username: String,
  rights: Rights,
  jwt: String
)

object LoginResult {

  val queryType: ObjectType[Unit, LoginResult] = {
    implicit val x0: EnumType[Rights] = Rights.graphQLType

    deriveObjectType()
  }

}

final case class GraphQLExerciseInput(
  title: String,
  text: String,
  sampleSolutionAsJson: String
)

final case class ChangePasswordInput(
  oldPassword: String,
  newPassword: String,
  newPasswordRepeat: String
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

  val registerInputArg: Argument[RegisterInput] = {
    implicit val x: OFormat[RegisterInput] = Json.format

    Argument("registerInput", deriveInputObjectType[RegisterInput]())
  }

  val loginInputArg: Argument[LoginInput] = {
    implicit val x: OFormat[LoginInput] = Json.format

    Argument("loginInput", deriveInputObjectType[LoginInput]())
  }

  val changePasswordInputArg: Argument[ChangePasswordInput] = {
    implicit val x: OFormat[ChangePasswordInput] = Json.format

    Argument("changePasswordInput", deriveInputObjectType[ChangePasswordInput]())
  }

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
