package model

import de.uniwue.ls6.matching.WordExtractor
import model.graphql.GraphQLArguments.relatedWordInputArgument
import model.graphql.{GraphQLBasics, GraphQLContext, UserFacingGraphQLError}
import sangria.macros.derive.{ObjectTypeName, deriveObjectType}
import sangria.schema.{Argument, BooleanType, Field, ObjectType, OptionType, StringType, fields}

import scala.annotation.unused
import scala.concurrent.{ExecutionContext, Future}

final case class RelatedWordsGroup(
  groupId: Int,
  content: Seq[DbRelatedWord]
)

object RelatedWordsGroupGraphQLTypes extends GraphQLBasics {

  private val wordArgument: Argument[String] = Argument("word", StringType)

  val queryType: ObjectType[GraphQLContext, RelatedWordsGroup] = {
    @unused implicit val x0: ObjectType[GraphQLContext, DbRelatedWord] = RelatedWordGraphQLTypes.queryType

    deriveObjectType(
      ObjectTypeName("RelatedWordsGroup")
    )
  }

  private val resolveDeleteRelatedWordsGroup: Resolver[RelatedWordsGroup, Boolean] = context =>
    context.ctx.tableDefs.futureDeleteRelatedWordsGroup(context.value.groupId)

  private val resolveSubmitRelatedWord: Resolver[RelatedWordsGroup, DbRelatedWord] = context => {
    @unused implicit val ec: ExecutionContext    = context.ctx.ec
    val groupId                                  = context.value.groupId
    val RelatedWordInput(newWord, newIsPositive) = context.arg(relatedWordInputArgument)

    val normalizedWord = WordExtractor.normalizeWord(newWord).toLowerCase

    for {
      inserted <- context.ctx.tableDefs.futureInsertRelatedWord(DbRelatedWord(groupId, normalizedWord, newIsPositive))
      _        <- futureFromBool(inserted, UserFacingGraphQLError("Couldn't insert related word!"))
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

trait RelatedWordsGroupRepository {
  self: TableDefs =>

  import profile.api._

  protected val relatedWordGroupsTQ = TableQuery[RelatedWordGroupsTable]

  def futureDeleteRelatedWordsGroup(groupId: Int): Future[Boolean] = for {
    rowCount <- db.run { relatedWordGroupsTQ.filter { _.groupId === groupId }.delete }
  } yield rowCount >= 1

  private val emptyRelatedWordsGroupInsertStatement = sql"insert into related_word_groups () values() returning group_id;".as[Int]

  def futureNewEmptyRelatedWordsGroup: Future[Int] = db.run(emptyRelatedWordsGroupInsertStatement.head)

  protected class RelatedWordGroupsTable(tag: Tag) extends Table[Int](tag, "related_word_groups") {
    def groupId = column[Int]("group_id", O.PrimaryKey)

    override def * = groupId
  }

}