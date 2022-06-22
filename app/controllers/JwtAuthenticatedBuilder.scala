package controllers

import com.google.inject.Inject
import model.{JwtHelpers, MongoQueries, User}
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

final case class JwtRequest[A](username: Option[User], request: Request[A]) extends WrappedRequest[A](request)

class JwtAction @Inject() (
  override val parser: BodyParsers.Default,
  mongoQueries: MongoQueries
)(override implicit val executionContext: ExecutionContext)
    extends ActionBuilder[JwtRequest, AnyContent]
    with ActionRefiner[Request, JwtRequest]
    with JwtHelpers {

  private val BearerRegex = raw"Bearer (.*)".r

  private def usernameFromRequest[A](request: Request[A]): Option[String] = for {
    authHeader <- request.headers.get("Authentication")
    token <- authHeader match {
      case BearerRegex(token) => Some(token)
      case _                  => None
    }
    deserializedToken <- deserializeJwt(token).toOption
    username          <- deserializedToken.subject
  } yield username

  override protected def refine[A](request: Request[A]): Future[Either[Result, JwtRequest[A]]] = usernameFromRequest(request) match {
    case None           => Future.successful(Right(JwtRequest(None, request)))
    case Some(username) => mongoQueries.futureMaybeUserByUsername(username).map(maybeUser => Right(JwtRequest(maybeUser, request)))
  }

}
