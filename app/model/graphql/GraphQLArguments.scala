package model.graphql

import model.{Exercise, FlatSolutionEntry, Rights}
import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.deriveInputObjectType
import sangria.marshalling.playJson._
import sangria.schema._

final case class RegisterInput(
  username: String,
  password: String,
  passwordRepeat: String
) {

  lazy val isValid: Boolean = password == passwordRepeat

}

final case class LoginInput(
  username: String,
  password: String
)

final case class ChangePasswordInput(
  oldPassword: String,
  newPassword: String,
  newPasswordRepeat: String
)

trait GraphQLArguments {

  val exerciseIdArg: Argument[Int] = Argument("exerciseId", IntType)

  val usernameArg: Argument[String] = Argument("username", StringType)

  val rightsArg: Argument[Rights] = Argument("rights", Rights.graphQLType)

  val prefixArg: Argument[String] = Argument("prefix", StringType)

  val solutionArg: Argument[Seq[FlatSolutionEntry]] = {
    implicit val x: OFormat[FlatSolutionEntry] = Json.format

    Argument[Seq[FlatSolutionEntry]]("solution", ListInputType(FlatSolutionEntry.inputType))
  }

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

  val exerciseInputArg: Argument[Exercise] = {
    implicit val x: OFormat[Exercise] = Json.format

    Argument("exerciseInput", Exercise.inputType)
  }

}
