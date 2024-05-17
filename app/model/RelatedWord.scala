package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{BooleanType, Field, ObjectType, StringType, fields}

final case class RelatedWordInput(
  word: String,
  isPositive: Boolean
)

final case class DbRelatedWord(
  groupId: Int,
  word: String,
  isPositive: Boolean
)

object RelatedWordGraphQLTypes extends GraphQLBasics {

  val queryType: ObjectType[GraphQLContext, DbRelatedWord] = ObjectType(
    "RelatedWord",
    fields[GraphQLContext, DbRelatedWord](
      Field("word", StringType, resolve = _.value.word),
      Field("isPositive", BooleanType, resolve = _.value.isPositive)
    )
  )

  private val resolveEditWord: Resolver[DbRelatedWord, DbRelatedWord] = unpackedResolverWithArgs {
    case (_, tableDefs, _ec, DbRelatedWord(groupId, word, _), args) =>
      implicit val ec = _ec

      val RelatedWordInput(newWord, newIsPositive) = args.arg(relatedWordInputArgument)

      for {
        _ <- tableDefs.futureUpdateRelatedWord(groupId, word, newWord, newIsPositive)
      } yield DbRelatedWord(groupId, newWord, newIsPositive)
  }

  private val resolveDeleteWord: Resolver[DbRelatedWord, DbRelatedWord] = unpackedResolver { case (_, tableDefs, _ec, dbRelatedWord) =>
    implicit val ec = _ec

    for {
      _ <- tableDefs.futureDeleteRelatedWord(dbRelatedWord)
    } yield dbRelatedWord
  }

  val mutationType: ObjectType[GraphQLContext, DbRelatedWord] = ObjectType(
    "RelatedWordMutations",
    fields[GraphQLContext, DbRelatedWord](
      Field("edit", RelatedWordGraphQLTypes.queryType, arguments = relatedWordInputArgument :: Nil, resolve = resolveEditWord),
      Field("delete", queryType, resolve = resolveDeleteWord)
    )
  )
}
