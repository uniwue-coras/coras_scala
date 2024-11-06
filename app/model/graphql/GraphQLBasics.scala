package model.graphql

import model.{Rights, TableDefs, User}
import play.api.libs.ws.WSClient
import sangria.schema.{Action, Args, Context}

import scala.concurrent.{ExecutionContext, Future}

trait GraphQLBasics extends GraphQLArguments {

  private val onInsufficientRights = UserFacingGraphQLError("Insufficient rights!")

  protected type Resolver[S, T] = Context[GraphQLContext, S] => Action[GraphQLContext, T]

  protected def unpackedResolver[S, T](f: (WSClient, TableDefs, ExecutionContext, S) => Action[GraphQLContext, T]): Resolver[S, T] = context =>
    f(context.ctx.ws, context.ctx.tableDefs, context.ctx.ec, context.value)

  protected def unpackedResolverWithUser[S, T](f: (WSClient, TableDefs, ExecutionContext, S, User, Args) => Action[GraphQLContext, T]): Resolver[S, T] =
    context =>
      context.ctx.user match {
        case None       => Future.failed(UserFacingGraphQLError("User is not logged in!"))
        case Some(user) => f(context.ctx.ws, context.ctx.tableDefs, context.ctx.ec, context.value, user, context.args)
      }

  protected def unpackedResolverWithCorrector[S, T](f: (WSClient, TableDefs, ExecutionContext, S, User, Args) => Action[GraphQLContext, T]): Resolver[S, T] =
    context =>
      context.ctx.user match {
        case None                                        => Future.failed(UserFacingGraphQLError("User is not logged in!"))
        case Some(user) if user.rights != Rights.Student => f(context.ctx.ws, context.ctx.tableDefs, context.ctx.ec, context.value, user, context.args)
        case _                                           => Future.failed(onInsufficientRights)
      }

  protected def unpackedResolverWithAdmin[S, T](f: (WSClient, TableDefs, ExecutionContext, S, User, Args) => Action[GraphQLContext, T]): Resolver[S, T] =
    context =>
      context.ctx.user match {
        case Some(user) if user.rights == Rights.Admin => f(context.ctx.ws, context.ctx.tableDefs, context.ctx.ec, context.value, user, context.args)
        case None                                      => Future.failed(UserFacingGraphQLError("User is not logged in!"))
        case _                                         => Future.failed(onInsufficientRights)
      }

  protected def unpackedResolverWithArgs[S, T](f: (WSClient, TableDefs, ExecutionContext, S, Args) => Action[GraphQLContext, T]): Resolver[S, T] = context =>
    f(context.ctx.ws, context.ctx.tableDefs, context.ctx.ec, context.value, context.args)

  protected def futureFromBool(value: Boolean, onFalse: Throwable): Future[Unit] = if (value) {
    Future.successful(())
  } else {
    Future.failed(onFalse)
  }

  protected def futureFromOption[T](value: Option[T], onError: Throwable): Future[T] = value match {
    case Some(t) => Future.successful(t)
    case None    => Future.failed(onError)
  }

}
