package model

import pdi.jwt.JwtSession
import play.api.Configuration
import play.api.libs.json.{Json, OFormat}

import java.time.Clock
import scala.util.Try

final case class MyJwtSessionContent(
  username: String,
  rights: Rights
)

trait JwtHelpers {

  protected implicit val clock: Clock = Clock.systemUTC()

  private val jsonFormat: OFormat[MyJwtSessionContent] = Json.format

  protected implicit val configuration: Configuration

  def createJwtSession(username: String, rights: Rights): JwtSession = JwtSession(
    jsClaim = jsonFormat.writes(
      MyJwtSessionContent(username, rights)
    )
  )

  def decodeJwtSession(jwtSession: JwtSession): Try[MyJwtSessionContent] = Try {
    jwtSession.claimData.as[MyJwtSessionContent](jsonFormat)
  }

}
