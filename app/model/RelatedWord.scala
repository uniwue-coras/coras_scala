package model

import model.graphql.{GraphQLArguments, GraphQLContext, UserFacingGraphQLError, Resolver}
import sangria.schema._

import scala.concurrent.ExecutionContext
import scala.concurrent.Future

trait RelatedWord:
  def word: String
  def isPositive: Boolean

final case class RelatedWordInput(
  word: String,
  isPositive: Boolean
) extends RelatedWord

final case class DbRelatedWord(
  groupId: Int,
  word: String,
  isPositive: Boolean
) extends RelatedWord

object RelatedWord:

  val queryType: ObjectType[GraphQLContext, DbRelatedWord] = ObjectType(
    "RelatedWord",
    fields[GraphQLContext, DbRelatedWord](
      Field("word", StringType, resolve = _.value.word),
      Field("isPositive", BooleanType, resolve = _.value.isPositive)
    )
  )

  private val resolveEditWord: Resolver[DbRelatedWord, DbRelatedWord] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    val RelatedWordInput(newWord, newIsPositive) = context.arg(GraphQLArguments.relatedWordInputArgument)
    val DbRelatedWord(groupId, word, _)          = context.value

    for {
      updated <- context.ctx.tableDefs.futureUpdateRelatedWord(groupId, word, newWord, newIsPositive)
      _       <- if updated then Future.successful(()) else Future.failed(UserFacingGraphQLError("Couldn't update related word..."))
    } yield DbRelatedWord(groupId, newWord, newIsPositive)
  }

  private val resolveDeleteWord: Resolver[DbRelatedWord, Boolean] = context => context.ctx.tableDefs.futureDeleteRelatedWord(context.value)

  val mutationType: ObjectType[GraphQLContext, DbRelatedWord] = ObjectType(
    "RelatedWordMutations",
    fields[GraphQLContext, DbRelatedWord](
      Field("edit", RelatedWord.queryType, arguments = GraphQLArguments.relatedWordInputArgument :: Nil, resolve = resolveEditWord),
      Field("delete", BooleanType, resolve = resolveDeleteWord)
    )
  )
