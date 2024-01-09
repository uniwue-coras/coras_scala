package model

import model.graphql.{GraphQLArguments, GraphQLContext, UserFacingGraphQLError, Resolver}
import model.matching.wordMatching.WordExtractor
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

final case class RelatedWordsGroup(
  groupId: Int,
  content: Seq[DbRelatedWord]
)

object RelatedWordsGroupGraphQLTypes:

  private val wordArgument: Argument[String] = Argument("word", StringType)

  val queryType: ObjectType[GraphQLContext, RelatedWordsGroup] = ObjectType(
    "RelatedWordsGroup",
    fields[GraphQLContext, RelatedWordsGroup](
      Field("groupId", IntType, resolve = _.value.groupId),
      Field("content", ListType(RelatedWord.queryType), resolve = _.value.content)
    )
  )

  private val resolveDeleteRelatedWordsGroup: Resolver[RelatedWordsGroup, Boolean] = context =>
    context.ctx.tableDefs.futureDeleteRelatedWordsGroup(context.value.groupId)

  private val resolveSubmitRelatedWord: Resolver[RelatedWordsGroup, DbRelatedWord] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    val groupId                                  = context.value.groupId
    val RelatedWordInput(newWord, newIsPositive) = context.arg(GraphQLArguments.relatedWordInputArgument)

    val normalizedWord = WordExtractor.normalizeWord(newWord).toLowerCase

    for {
      inserted <- context.ctx.tableDefs.futureInsertRelatedWord(DbRelatedWord(groupId, normalizedWord, newIsPositive))
      _        <- if inserted then Future.successful(()) else Future.failed(UserFacingGraphQLError("Couldn't insert related word!"))
    } yield DbRelatedWord(groupId, normalizedWord, newIsPositive)
  }

  private val resolveRelatedWord: Resolver[RelatedWordsGroup, Option[DbRelatedWord]] = context =>
    context.value.content.find { _.word == context.arg(wordArgument) }

  val mutationType: ObjectType[GraphQLContext, RelatedWordsGroup] = ObjectType(
    "RelatedWordGroupMutations",
    fields[GraphQLContext, RelatedWordsGroup](
      Field("delete", BooleanType, resolve = resolveDeleteRelatedWordsGroup),
      Field("submitRelatedWord", RelatedWord.queryType, arguments = GraphQLArguments.relatedWordInputArgument :: Nil, resolve = resolveSubmitRelatedWord),
      Field("relatedWord", OptionType(RelatedWord.mutationType), arguments = wordArgument :: Nil, resolve = resolveRelatedWord)
    )
  )

trait RelatedWordsGroupRepository:
  self: TableDefs =>

  import profile.api._

  protected val relatedWordGroupsTQ = TableQuery[RelatedWordGroupsTable]

  def futureDeleteRelatedWordsGroup(groupId: Int): Future[Boolean] = for {
    rowCount <- db.run { relatedWordGroupsTQ.filter { _.groupId === groupId }.delete }
  } yield rowCount >= 1

  private val emptyRelatedWordsGroupInsertStatement = sql"insert into related_word_groups () values() returning group_id;".as[Int]

  def futureNewEmptyRelatedWordsGroup: Future[Int] = db.run(emptyRelatedWordsGroupInsertStatement.head)

  protected class RelatedWordGroupsTable(tag: Tag) extends Table[Int](tag, "related_word_groups"):
    def groupId    = column[Int]("group_id", O.PrimaryKey)
    override def * = groupId
