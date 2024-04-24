package model

import model.exporting.LeafExportable
import model.graphql.{GraphQLBasics, GraphQLContext}
import sangria.schema.{BooleanType, Field, ObjectType, StringType, fields}

import scala.concurrent.ExecutionContext

final case class RelatedWordInput(
  word: String,
  isPositive: Boolean
)

final case class DbRelatedWord(
  groupId: Int,
  word: String,
  isPositive: Boolean
) extends RelatedWord
    with LeafExportable[ExportedRelatedWord]:
  override def exportData: ExportedRelatedWord = ExportedRelatedWord(word, isPositive)

object RelatedWordGraphQLTypes extends GraphQLBasics:

  val queryType: ObjectType[GraphQLContext, DbRelatedWord] = ObjectType(
    "RelatedWord",
    fields[GraphQLContext, DbRelatedWord](
      Field("word", StringType, resolve = _.value.word),
      Field("isPositive", BooleanType, resolve = _.value.isPositive)
    )
  )

  private val resolveEditWord: Resolver[DbRelatedWord, DbRelatedWord] = unpackedResolverWithArgs {
    case (GraphQLContext(_, tableDefs, _, given ExecutionContext), DbRelatedWord(groupId, word, _), args) =>
      val RelatedWordInput(newWord, newIsPositive) = args.arg(relatedWordInputArgument)

      for {
        _ <- tableDefs.futureUpdateRelatedWord(groupId, word, newWord, newIsPositive)
      } yield DbRelatedWord(groupId, newWord, newIsPositive)
  }

  private val resolveDeleteWord: Resolver[DbRelatedWord, Boolean] = context => context.ctx.tableDefs.futureDeleteRelatedWord(context.value)

  val mutationType: ObjectType[GraphQLContext, DbRelatedWord] = ObjectType(
    "RelatedWordMutations",
    fields[GraphQLContext, DbRelatedWord](
      Field("edit", RelatedWordGraphQLTypes.queryType, arguments = relatedWordInputArgument :: Nil, resolve = resolveEditWord),
      Field("delete", BooleanType, resolve = resolveDeleteWord)
    )
  )
