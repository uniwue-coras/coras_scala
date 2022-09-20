package controllers

import com.google.inject.Inject
import model.{JwtHelpers, TableDefs, User}
import pdi.jwt.JwtSession
import pdi.jwt.JwtSession.RichRequestHeader
import play.api.Configuration
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success, Try}

final case class JwtRequest[A](username: Option[User], request: Request[A]) extends WrappedRequest[A](request)

class JwtAction @Inject() (
  override val parser: BodyParsers.Default,
  tableDefs: TableDefs
)(
  override implicit val executionContext: ExecutionContext,
  implicit val configuration: Configuration
) extends ActionBuilder[JwtRequest, AnyContent]
    with ActionRefiner[Request, JwtRequest]
    with JwtHelpers {

  private def usernameFromRequest[A](request: Request[A]): Try[String] = for {
    _ <-
      if (request.hasJwtHeader) {
        Success(())
      } else {
        Failure(new Exception(s"Header ${JwtSession.REQUEST_HEADER_NAME} is not present!"))
      }

    mySession <- decodeJwtSession(request.jwtSession)
  } yield mySession.username

  override protected def refine[A](request: Request[A]): Future[Either[Result, JwtRequest[A]]] = usernameFromRequest(request) match {
    case Failure(_)        => Future.successful(Right(JwtRequest(None, request)))
    case Success(username) => tableDefs.futureMaybeUserByUsername(username).map(maybeUser => Right(JwtRequest(maybeUser, request)))
  }

}
