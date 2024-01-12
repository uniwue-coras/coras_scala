package model

import model.graphql.{GraphQLArguments, GraphQLContext, Resolver}
import sangria.schema._

import scala.concurrent.ExecutionContext

final case class RelatedWord(
  word: String,
  isPositive: Boolean
)

type DbRelatedWord = (Int, RelatedWord)

object RelatedWord:

  val queryType: ObjectType[GraphQLContext, DbRelatedWord] = ObjectType(
    "RelatedWord",
    fields[GraphQLContext, DbRelatedWord](
      Field("word", StringType, resolve = _.value._2.word),
      Field("isPositive", BooleanType, resolve = _.value._2.isPositive)
    )
  )

  private val resolveEditWord: Resolver[DbRelatedWord, DbRelatedWord] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    val RelatedWord(newWord, newIsPositive) = context.arg(GraphQLArguments.relatedWordInputArgument)
    val (groupId, RelatedWord(word, _))     = context.value

    for {
      _ <- context.ctx.tableDefs.futureUpdateRelatedWord(groupId, word, newWord, newIsPositive)
    } yield (groupId, RelatedWord(newWord, newIsPositive))
  }

  private val resolveDeleteWord: Resolver[DbRelatedWord, Boolean] = context => context.ctx.tableDefs.futureDeleteRelatedWord(context.value)

  val mutationType: ObjectType[GraphQLContext, DbRelatedWord] = ObjectType(
    "RelatedWordMutations",
    fields[GraphQLContext, DbRelatedWord](
      Field("edit", RelatedWord.queryType, arguments = GraphQLArguments.relatedWordInputArgument :: Nil, resolve = resolveEditWord),
      Field("delete", BooleanType, resolve = resolveDeleteWord)
    )
  )
