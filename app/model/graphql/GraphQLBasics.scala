package model.graphql

import model.{Rights, User}
import sangria.schema.{Action, Args, Context}

import scala.concurrent.Future

trait GraphQLBasics:

  private val onInsufficientRights = UserFacingGraphQLError("Insufficient rights!")

  protected type Resolver[S, T] = Context[GraphQLContext, S] => Action[GraphQLContext, T]

  protected def unpackedResolver[S, T](f: (GraphQLContext, S) => Action[GraphQLContext, T]): Resolver[S, T] = context => f(context.ctx, context.value)

  protected def unpackedResolverWithArgs[S, T](f: (GraphQLContext, S, Args) => Action[GraphQLContext, T]): Resolver[S, T] = context =>
    f(context.ctx, context.value, context.args)

  protected def futureFromBool(value: Boolean, onFalse: Throwable): Future[Unit] = if (value) {
    Future.successful(())
  } else {
    Future.failed(onFalse)
  }

  protected def futureFromOption[T](value: Option[T], onError: Throwable): Future[T] = value match {
    case Some(t) => Future.successful(t)
    case None    => Future.failed(onError)
  }

  protected def resolveWithUser[S, T](f: (Context[GraphQLContext, S], User) => Future[T]): Resolver[S, T] = context =>
    context.ctx.user match {
      case None       => Future.failed(UserFacingGraphQLError("User is not logged in!"))
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
