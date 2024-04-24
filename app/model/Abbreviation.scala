package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{BooleanType, Field, ObjectType, StringType, fields}

import scala.concurrent.ExecutionContext

final case class Abbreviation(abbreviation: String, word: String)

object AbbreviationGraphQLTypes extends GraphQLBasics:

  val queryType: ObjectType[GraphQLContext, Abbreviation] = ObjectType(
    "Abbreviation",
    fields[GraphQLContext, Abbreviation](
      Field("abbreviation", StringType, resolve = _.value.abbreviation),
      Field("word", StringType, resolve = _.value.word)
    )
  )

  private val resolveEdit: Resolver[Abbreviation, Abbreviation] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, given ExecutionContext), Abbreviation(abbreviation, _), args) =>
      val input = args.arg(abbreviationInputArgument)

      for {
        _ <- tableDefs.futureUpdateAbbreviation(abbreviation, input.abbreviation, input.word)
      } yield input
  }

  private val resolveDelete: Resolver[Abbreviation, Boolean] = unpackedResolver {
    case (GraphQLContext(_, tableDefs, _, given ExecutionContext), Abbreviation(abbreviation, _)) =>
      for {
        _ <- tableDefs.futureDeleteAbbreviation(abbreviation)
      } yield true
  }

  val mutationType: ObjectType[GraphQLContext, Abbreviation] = ObjectType(
    "AbbreviationMutations",
    fields[GraphQLContext, Abbreviation](
      Field("edit", queryType, arguments = abbreviationInputArgument :: Nil, resolve = resolveEdit),
      Field("delete", BooleanType, resolve = resolveDelete)
    )
  )
