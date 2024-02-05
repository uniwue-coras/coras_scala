package model

import model.graphql.{GraphQLArguments, GraphQLContext, MyMutationType, MyQueryType}
import sangria.schema.{BooleanType, Field, ObjectType, StringType, fields}

import scala.concurrent.ExecutionContext

final case class Abbreviation(abbreviation: String, word: String)

object AbbreviationGraphQLTypes extends MyQueryType[Abbreviation] with MyMutationType[Abbreviation]:
  override val queryType: ObjectType[GraphQLContext, Abbreviation] = ObjectType(
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
      _ <- context.ctx.tableDefs.futureUpdateAbbreviation(context.value.abbreviation, input.abbreviation, input.word)
    } yield input
  }

  private val resolveDelete: Resolver[Abbreviation, Boolean] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    for {
      _ <- context.ctx.tableDefs.futureDeleteAbbreviation(context.value.abbreviation)
    } yield true
  }

  override val mutationType: ObjectType[GraphQLContext, Abbreviation] = ObjectType(
    "AbbreviationMutations",
    fields[GraphQLContext, Abbreviation](
      Field("edit", queryType, arguments = GraphQLArguments.abbreviationInputArgument :: Nil, resolve = resolveEdit),
      Field("delete", BooleanType, resolve = resolveDelete)
    )
  )
