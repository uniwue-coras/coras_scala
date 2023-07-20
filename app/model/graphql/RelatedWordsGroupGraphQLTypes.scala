package model.graphql

import model.graphql.GraphQLArguments.{relatedWordInputArgument, wordArgument}
import model.matching.WordExtractor
import model.{RelatedWord, RelatedWordInput, RelatedWordsGroup}
import sangria.macros.derive.deriveObjectType
import sangria.schema._

import scala.annotation.unused
import scala.concurrent.ExecutionContext

object RelatedWordGraphQLTypes extends GraphQLBasics {

  val queryType: ObjectType[GraphQLContext, RelatedWord] = deriveObjectType()

  private val resolveEditWord: Resolver[RelatedWord, RelatedWord] = context => {
    @unused implicit val ec: ExecutionContext    = context.ctx.ec
    val RelatedWordInput(newWord, newIsPositive) = context.arg(relatedWordInputArgument)
    val RelatedWord(groupId, word, _)            = context.value

    for {
      updated <- context.ctx.tableDefs.futureUpdateRelatedWord(groupId, word, newWord, newIsPositive)
      _       <- futureFromBool(updated, UserFacingGraphQLError("Couldn't update related word..."))
    } yield RelatedWord(groupId, newWord, newIsPositive)
  }

  private val resolveDeleteWord: Resolver[RelatedWord, Boolean] = context => {
    val RelatedWord(groupId, word, _) = context.value

    context.ctx.tableDefs.futureDeleteRelatedWord(groupId, word)
  }

  val mutationType: ObjectType[GraphQLContext, RelatedWord] = ObjectType(
    "RelatedWordMutations",
    fields[GraphQLContext, RelatedWord](
      Field("edit", RelatedWordGraphQLTypes.queryType, arguments = relatedWordInputArgument :: Nil, resolve = resolveEditWord),
      Field("delete", BooleanType, resolve = resolveDeleteWord)
    )
  )
}

object RelatedWordsGroupGraphQLTypes extends GraphQLBasics {

  val queryType: ObjectType[GraphQLContext, RelatedWordsGroup] = {
    @unused implicit val x0: ObjectType[GraphQLContext, RelatedWord] = RelatedWordGraphQLTypes.queryType

    deriveObjectType()
  }

  private val resolveDeleteRelatedWordsGroup: Resolver[RelatedWordsGroup, Boolean] = context =>
    context.ctx.tableDefs.futureDeleteRelatedWordsGroup(context.value.groupId)

  private val resolveSubmitRelatedWord: Resolver[RelatedWordsGroup, RelatedWord] = context => {
    @unused implicit val ec: ExecutionContext    = context.ctx.ec
    val groupId                                  = context.value.groupId
    val RelatedWordInput(newWord, newIsPositive) = context.arg(relatedWordInputArgument)

    val normalizedWord = WordExtractor.normalizeWord(newWord).toLowerCase

    for {
      inserted <- context.ctx.tableDefs.futureInsertRelatedWord(groupId, normalizedWord, newIsPositive)
      _        <- futureFromBool(inserted, UserFacingGraphQLError("Couldn't insert related word!"))
    } yield RelatedWord(groupId, normalizedWord, newIsPositive)
  }

  private val resolveRelatedWord: Resolver[RelatedWordsGroup, Option[RelatedWord]] = context =>
    context.value.content.find { _.word == context.arg(wordArgument) }

  val mutationType: ObjectType[GraphQLContext, RelatedWordsGroup] = ObjectType(
    "RelatedWordGroupMutations",
    fields[GraphQLContext, RelatedWordsGroup](
      Field("delete", BooleanType, resolve = resolveDeleteRelatedWordsGroup),
      Field("submitRelatedWord", RelatedWordGraphQLTypes.queryType, arguments = relatedWordInputArgument :: Nil, resolve = resolveSubmitRelatedWord),
      Field("relatedWord", OptionType(RelatedWordGraphQLTypes.mutationType), arguments = wordArgument :: Nil, resolve = resolveRelatedWord)
    )
  )

}
