package model.graphql

import model._
import play.api.libs.json.{JsError, JsSuccess, Json, Reads}
import sangria.schema.Context

import scala.concurrent.{ExecutionContext, Future}

trait GraphQLBasics {

  private val onNoLogin = UserFacingGraphQLError("User is not logged in!")

  private val onInsufficientRights = UserFacingGraphQLError("Insufficient rights!")

  protected type Resolver[S, T] = Context[GraphQLContext, S] => sangria.schema.Action[GraphQLContext, T]

  protected def resolveWithUser[S, T](f: (Context[GraphQLContext, S], User) => Future[T]): Resolver[S, T] = context =>
    context.ctx.user match {
      case None       => Future.failed(onNoLogin)
      case Some(user) => f(context, user)
    }

  protected def resolveWithCorrector[S, T](f: (Context[GraphQLContext, S], User) => Future[T]): Resolver[S, T] = resolveWithUser {
    case (context, user) if user.rights != Rights.Student => f(context, user)
    case _                                                => Future.failed(onInsufficientRights)
  }

  protected def resolveWithAdmin[S, T](f: (Context[GraphQLContext, S], User) => Future[T]): Resolver[S, T] = resolveWithUser {
    case (context, user) if user.rights == Rights.Admin => f(context, user)
    case _                                              => Future.failed(onInsufficientRights)
  }

  @deprecated
  protected def readSolutionFromJsonString(solutionString: String)(implicit ec: ExecutionContext): Future[Seq[SolutionNode]] = for {
    jsValue <- Future(Json.parse(solutionString))

    solution <- Json.fromJson[Seq[SolutionNode]](jsValue)(Reads.seq(SolutionNode.solutionNodeJsonFormat)) match {
      case JsSuccess(value, _) => Future.successful(value)
      case JsError(_)          => Future.failed(UserFacingGraphQLError("Sample solution was not valid JSON!"))
    }
  } yield solution

  @deprecated
  protected def readCorrectionFromJsonString(jsonString: String)(implicit ec: ExecutionContext): Future[SolutionNodeMatchingResult] = for {
    jsValue <- Future(Json.parse(jsonString))

    correction <- Json.fromJson(jsValue)(Correction.correctionJsonFormat) match {
      case JsSuccess(value, _) => Future.successful(value)
      case JsError(_)          => Future.failed(UserFacingGraphQLError("Correction was not valid JSON!"))
    }
  } yield correction

}
