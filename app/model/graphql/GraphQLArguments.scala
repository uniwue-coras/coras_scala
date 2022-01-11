package model.graphql

import model._
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

  val solutionArg: Argument[Seq[FlatSolutionEntryInput]] = {
    implicit val x: OFormat[FlatSolutionEntryInput] = FlatSolutionEntry.inputJsonFormat

    Argument[Seq[FlatSolutionEntryInput]]("solution", ListInputType(FlatSolutionEntry.inputType))
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

  val exerciseInputArg: Argument[ExerciseInput] = {
    implicit val x: OFormat[ExerciseInput] = ExerciseGraphQLModel.inputJsonFormat

    Argument("exerciseInput", ExerciseGraphQLModel.inputType)
  }

  val entryCorrectionsArg: Argument[Seq[EntryCorrectionInput]] = {
    implicit val x: OFormat[EntryCorrectionInput] = EntryCorrection.inputJsonFormat

    Argument[Seq[EntryCorrectionInput]]("entryCorrections", ListInputType(EntryCorrection.inputType))
  }

}
