package model

import model.graphql.{GraphQLBasics, GraphQLContext}
import model.matching.wordMatching.WordExtractor
import sangria.schema._

import scala.concurrent.{ExecutionContext, Future}

final case class RelatedWordsGroup(
  groupId: Int,
  content: Seq[DbRelatedWord]
)

object RelatedWordsGroupGraphQLTypes extends GraphQLBasics {

  private val wordArgument: Argument[String] = Argument("word", StringType)

  val queryType: ObjectType[GraphQLContext, RelatedWordsGroup] = ObjectType(
    "RelatedWordsGroup",
    fields[GraphQLContext, RelatedWordsGroup](
      Field("groupId", IntType, resolve = _.value.groupId),
      Field("content", ListType(RelatedWordGraphQLTypes.queryType), resolve = _.value.content)
    )
  )

  private val resolveDeleteRelatedWordsGroup: Resolver[RelatedWordsGroup, Boolean] = context =>
    context.ctx.tableDefs.futureDeleteRelatedWordsGroup(context.value.groupId)

  private val resolveSubmitRelatedWord: Resolver[RelatedWordsGroup, DbRelatedWord] = unpackedResolverWithArgs {
    case (_, tableDefs, _ec, RelatedWordsGroup(groupId, _), args) =>
      implicit val ec: ExecutionContext = _ec

      val RelatedWordInput(newWord, newIsPositive) = args.arg(relatedWordInputArgument)
      val normalizedWord                           = WordExtractor.normalizeWord(newWord).toLowerCase

      for {
        _ <- tableDefs.futureInsertRelatedWord(DbRelatedWord(groupId, normalizedWord, newIsPositive))
      } yield DbRelatedWord(groupId, normalizedWord, newIsPositive)
  }

  private val resolveRelatedWord: Resolver[RelatedWordsGroup, Option[DbRelatedWord]] = context =>
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

trait RelatedWordGroupRepository {
  self: TableDefs =>

  import profile.api._

  protected val relatedWordGroupsTQ = TableQuery[RelatedWordGroupsTable]

  def futureDeleteRelatedWordsGroup(groupId: Int): Future[Boolean] = for {
    rowCount <- db.run { relatedWordGroupsTQ.filter { _.groupId === groupId }.delete }
  } yield rowCount >= 1

  private val emptyRelatedWordsGroupInsertStatement = sql"insert into related_word_groups () values() returning group_id;".as[Int]

  def futureNewEmptyRelatedWordsGroup: Future[Int] = db.run(emptyRelatedWordsGroupInsertStatement.head)

  protected class RelatedWordGroupsTable(tag: Tag) extends Table[Int](tag, "related_word_groups") {
    def groupId    = column[Int]("group_id", O.PrimaryKey)
    override def * = groupId
  }
}
