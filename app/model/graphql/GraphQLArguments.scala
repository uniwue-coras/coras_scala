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

final case class ChangePasswordInput(
  oldPassword: String,
  newPassword: String,
  newPasswordRepeat: String
)

trait GraphQLArguments {

  val exerciseIdArg: Argument[Int] = Argument("exerciseId", IntType)

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

}
