package model

import model.graphql.GraphQLArguments.relatedWordInputArgument
import model.graphql.{GraphQLContext, MyMutationType, MyQueryType, UserFacingGraphQLError}
import sangria.schema.{BooleanType, Field, ObjectType, StringType, fields}

import scala.concurrent.{ExecutionContext, Future}

final case class RelatedWordInput(
  word: String,
  isPositive: Boolean
)

final case class DbRelatedWord(
  groupId: Int,
  word: String,
  isPositive: Boolean
) extends RelatedWord

object RelatedWordGraphQLTypes extends MyQueryType[DbRelatedWord] with MyMutationType[DbRelatedWord]:
  override val queryType: ObjectType[GraphQLContext, DbRelatedWord] = ObjectType(
    "RelatedWord",
    fields[GraphQLContext, DbRelatedWord](
      Field("word", StringType, resolve = _.value.word),
      Field("isPositive", BooleanType, resolve = _.value.isPositive)
    )
  )

  private val resolveEditWord: Resolver[DbRelatedWord, DbRelatedWord] = context => {
    implicit val ec: ExecutionContext = context.ctx.ec

    val RelatedWordInput(newWord, newIsPositive) = context.arg(relatedWordInputArgument)
    val DbRelatedWord(groupId, word, _)          = context.value

    for {
      updated <- context.ctx.tableDefs.futureUpdateRelatedWord(groupId, word, newWord, newIsPositive)
      _       <- futureFromBool(updated, UserFacingGraphQLError("Couldn't update related word..."))
    } yield DbRelatedWord(groupId, newWord, newIsPositive)
  }

  private val resolveDeleteWord: Resolver[DbRelatedWord, Boolean] = context => context.ctx.tableDefs.futureDeleteRelatedWord(context.value)

  override val mutationType: ObjectType[GraphQLContext, DbRelatedWord] = ObjectType(
    "RelatedWordMutations",
    fields[GraphQLContext, DbRelatedWord](
      Field("edit", RelatedWordGraphQLTypes.queryType, arguments = relatedWordInputArgument :: Nil, resolve = resolveEditWord),
      Field("delete", BooleanType, resolve = resolveDeleteWord)
    )
  )

trait RelatedWordsRepository:
  self: TableDefs =>

  import profile.api._

  private val relatedWordsTQ = TableQuery[RelatedWordsTable]

  def futureAllRelatedWordGroups: Future[Seq[RelatedWordsGroup]] = for {
    rows <- db.run { relatedWordsTQ.result }

    groups = rows
      .groupBy(_.groupId)
      .filter(_._2.nonEmpty)
      .map { case (groupId, wordsInGroup) => RelatedWordsGroup(groupId, wordsInGroup) }
      .toSeq
  } yield groups

  def futureRelatedWordGroupByGroupId(groupId: Int): Future[Option[RelatedWordsGroup]] = for {
    relatedWordsInGroup <- db.run { relatedWordsTQ.filter { _.groupId === groupId }.result }

    maybeGroup = if (relatedWordsInGroup.isEmpty) None else Some(RelatedWordsGroup(groupId, relatedWordsInGroup))
  } yield maybeGroup

  def futureInsertRelatedWord(relatedWord: DbRelatedWord): Future[Boolean] = for {
    rowCount <- db.run { relatedWordsTQ += relatedWord }
  } yield rowCount == 1

  def futureUpdateRelatedWord(groupId: Int, word: String, newWord: String, newIsPositive: Boolean): Future[Boolean] = for {
    rowCount <- db.run {
      relatedWordsTQ
        .filter { relatedWord => relatedWord.groupId === groupId && relatedWord.word === word }
        .map { relatedWord => (relatedWord.word, relatedWord.isPositive) }
        .update { (newWord, newIsPositive) }
    }
  } yield rowCount == 1

  def futureDeleteRelatedWord(relatedWord: DbRelatedWord): Future[Boolean] = for {
    rowCount <- db.run { relatedWordsTQ.filter { row => row.groupId === relatedWord.groupId && row.word === relatedWord.word }.delete }
  } yield rowCount == 1

  protected class RelatedWordsTable(tag: Tag) extends Table[DbRelatedWord](tag, "related_words"):
    def groupId    = column[Int]("group_id")
    def word       = column[String]("value", O.PrimaryKey)
    def isPositive = column[Boolean]("is_positive")

    def groupFk = foreignKey("related_words_group_fk", groupId, relatedWordGroupsTQ)(_.groupId, onUpdate = cascade, onDelete = cascade)

    override def * = (groupId, word, isPositive).mapTo[DbRelatedWord]
