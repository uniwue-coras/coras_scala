package model

import pdi.jwt.{JwtClaim, JwtJson}

import java.time.Clock
import scala.util.Try

trait JwtHelpers {

  private implicit val clock: Clock = Clock.systemDefaultZone()

  protected def generateJwt(username: String): String = JwtJson.encode(
    JwtClaim(subject = Some(username))
  )

  protected def deserializeJwt(jwtString: String): Try[JwtClaim] = JwtJson.decode(jwtString)

}
