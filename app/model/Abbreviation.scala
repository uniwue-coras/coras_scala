package model

import model.graphql.{GraphQLArguments, GraphQLContext, UserFacingGraphQLError, Resolver}
import sangria.schema.{BooleanType, Field, ObjectType, StringType, fields}

import scala.concurrent.ExecutionContext
import scala.concurrent.Future

final case class Abbreviation(
  abbreviation: String,
  word: String
)

object Abbreviation:
  val queryType: ObjectType[GraphQLContext, Abbreviation] = ObjectType(
    "Abbreviation",
    fields[GraphQLContext, Abbreviation](
      Field("abbreviation", StringType, resolve = _.value.abbreviation),
      Field("word", StringType, resolve = _.value.word)
    )
  )

  private val resolveEdit: Resolver[Abbreviation, Abbreviation] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    val input = context.arg(GraphQLArguments.abbreviationInputArgument)

    for {
      updated <- context.ctx.tableDefs.futureUpdateAbbreviation(context.value.abbreviation, input.abbreviation, input.word)
      _       <- if updated then Future.successful(()) else Future.failed(UserFacingGraphQLError("Couldn't update abbreviation!"))
    } yield input
  }

  private val resolveDelete: Resolver[Abbreviation, Boolean] = context => context.ctx.tableDefs.futureDeleteAbbreviation(context.value.abbreviation)

  val mutationType: ObjectType[GraphQLContext, Abbreviation] = ObjectType(
    "AbbreviationMutations",
    fields[GraphQLContext, Abbreviation](
      Field("edit", queryType, arguments = GraphQLArguments.abbreviationInputArgument :: Nil, resolve = resolveEdit),
      Field("delete", BooleanType, resolve = resolveDelete)
    )
  )
