package model.graphql

import play.api.libs.json.{Json, OFormat}
import sangria.macros.derive.deriveInputObjectType
import sangria.marshalling.playJson._
import sangria.schema.Argument

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

trait GraphQLArguments {

  val registerInputArg: Argument[RegisterInput] = {
    implicit val x: OFormat[RegisterInput] = Json.format

    Argument("registerInput", deriveInputObjectType[RegisterInput]())
  }

  val loginInputArg: Argument[LoginInput] = {
    implicit val x: OFormat[LoginInput] = Json.format

    Argument("loginInput", deriveInputObjectType[LoginInput]())
  }

}
