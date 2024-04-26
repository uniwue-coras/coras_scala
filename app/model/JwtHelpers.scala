package model

import pdi.jwt.JwtJson
import play.api.libs.json.{JsResult, Json, OFormat}

import scala.util.Try

final case class MyJwtSessionContent(
  username: String,
  rights: Rights
)

trait JwtHelpers {

  private val jsonFormat: OFormat[MyJwtSessionContent] = Json.format

  def createJwtSession(username: String, rights: Rights): String = JwtJson.encode(
    jsonFormat.writes(
      MyJwtSessionContent(username, rights)
    )
  )

  def decodeJwtSession(token: String): Try[MyJwtSessionContent] = for {
    jsValue <- JwtJson.decodeJson(token)

    session <- JsResult.toTry(
      jsonFormat.reads(jsValue),
      _ => new Exception("Could not read jwt")
    )
  } yield session
}
