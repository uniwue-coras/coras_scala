package controllers
import com.google.inject.Inject
import model.JwtHelpers
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

class JwtRequest[A](val username: String, request: Request[A]) extends WrappedRequest[A](request)

class JwtAuthenticatedAction @Inject() (override val parser: BodyParsers.Default)(override implicit val executionContext: ExecutionContext)
    extends ActionBuilder[JwtRequest, AnyContent]
    with ActionRefiner[Request, JwtRequest]
    with JwtHelpers {

  private val BearerRegex = raw"Bearer (.*)".r

  override protected def refine[A](request: Request[A]): Future[Either[Result, JwtRequest[A]]] = Future.successful {

    val maybeUsername = for {
      authHeader <- request.headers.get("Authentication")
      token <- authHeader match {
        case BearerRegex(token) => Some(token)
        case _                  => None
      }
      deserializedToken <- deserializeJwt(token).toOption
      username          <- deserializedToken.subject
    } yield username

    maybeUsername match {
      case None           => Left(Results.Forbidden)
      case Some(username) => Right(new JwtRequest(username, request))
    }

  }

}
