package model.graphql

import model._
import play.api.libs.json.{JsError, JsSuccess, Json, Reads}
import sangria.schema.Context

import scala.concurrent.{ExecutionContext, Future}

trait GraphQLBasics {

  protected type Ctx[S] = Context[GraphQLContext, S]

  protected type Resolver[S, T] = Ctx[S] => sangria.schema.Action[GraphQLContext, T]

  protected def withUser[T, V](f: User => Future[T])(implicit context: Context[GraphQLContext, V]): Future[T] = context.ctx.user match {
    case None       => Future.failed(UserFacingGraphQLError("User is not logged in!"))
    case Some(user) => f(user)
  }

  protected def withCorrectorUser[T, V](f: User => Future[T])(implicit context: Context[GraphQLContext, V]): Future[T] = withUser {
    case user if user.rights != Rights.Student => f(user)
    case _                                     => Future.failed(UserFacingGraphQLError("User has insufficient rights!"))
  }

  protected def withAdminUser[T, V](f: User => Future[T])(implicit context: Context[GraphQLContext, V]): Future[T] = withUser {
    case user if user.rights == Rights.Admin => f(user)
    case _                                   => Future.failed(UserFacingGraphQLError("User has insufficient rights!"))
  }

  protected def readSolutionFromJsonString(solutionString: String)(implicit ec: ExecutionContext): Future[Seq[SolutionNode]] = for {
    jsValue <- Future(Json.parse(solutionString))

    solution <- Json.fromJson[Seq[SolutionNode]](jsValue)(Reads.seq(SolutionNode.solutionNodeJsonFormat)) match {
      case JsSuccess(value, _) => Future.successful(value)
      case JsError(_)          => Future.failed(UserFacingGraphQLError("Sample solution was not valid JSON!"))
    }
  } yield solution

  protected def readCorrectionFromJsonString(jsonString: String)(implicit ec: ExecutionContext): Future[SolutionNodeMatchingResult] = for {
    jsValue <- Future(Json.parse(jsonString))

    correction <- Json.fromJson(jsValue)(Correction.correctionJsonFormat) match {
      case JsSuccess(value, _) => Future.successful(value)
      case JsError(_)          => Future.failed(UserFacingGraphQLError("Correction was not valid JSON!"))
    }
  } yield correction

}
