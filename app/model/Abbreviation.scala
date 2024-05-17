package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{Field, ObjectType, StringType, fields}

final case class Abbreviation(abbreviation: String, word: String)

object AbbreviationGraphQLTypes extends GraphQLBasics {

  val queryType: ObjectType[GraphQLContext, Abbreviation] = ObjectType(
    "Abbreviation",
    fields[GraphQLContext, Abbreviation](
      Field("abbreviation", StringType, resolve = _.value.abbreviation),
      Field("word", StringType, resolve = _.value.word)
    )
  )

  private val resolveEdit: Resolver[Abbreviation, Abbreviation] = unpackedResolverWithArgs { case (_, tableDefs, _ec, Abbreviation(oldAbbreviation, _), args) =>
    implicit val ec = _ec

    val Abbreviation(newAbbreviation, newWord) = args.arg(abbreviationInputArgument)

    for {
      _ <- tableDefs.futureUpdateAbbreviation(oldAbbreviation, newAbbreviation, newWord)
    } yield Abbreviation(newAbbreviation, newWord)
  }

  private val resolveDelete: Resolver[Abbreviation, Abbreviation] = unpackedResolver { case (_, tableDefs, _ec, Abbreviation(abbreviation, word)) =>
    implicit val ec = _ec

    for {
      _ <- tableDefs.futureDeleteAbbreviation(abbreviation)
    } yield Abbreviation(abbreviation, word)
  }

  val mutationType: ObjectType[GraphQLContext, Abbreviation] = ObjectType(
    "AbbreviationMutations",
    fields[GraphQLContext, Abbreviation](
      Field("edit", queryType, arguments = abbreviationInputArgument :: Nil, resolve = resolveEdit),
      Field("delete", queryType, resolve = resolveDelete)
    )
  )
}
