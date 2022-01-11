package model

import pdi.jwt.{JwtClaim, JwtJson}
import play.api.mvc.RequestHeader

import java.time.Clock
import scala.concurrent.Future
import scala.util.Try

trait JwtHelpers {

  private implicit val clock: Clock = Clock.systemDefaultZone()

  protected def generateJwt(username: String): String = JwtJson.encode(
    JwtClaim(subject = Some(username))
  )

  protected def deserializeJwt(jwtString: String): Try[JwtClaim] = JwtJson.decode(jwtString)

  protected def userFromHeader(request: RequestHeader, tableDefs: TableDefs): Future[Option[User]] = {
    val maybeUsername = for {
      header   <- request.headers.get("Authorization")
      jwt      <- deserializeJwt(header).toOption
      username <- jwt.subject
    } yield username

    maybeUsername match {
      case None           => Future.successful(None)
      case Some(username) => tableDefs.futureMaybeUserByName(username)
    }

  }

}
