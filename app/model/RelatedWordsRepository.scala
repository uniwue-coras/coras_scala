package model

import scala.annotation.unused
import scala.concurrent.Future

final case class RelatedWordInput(
  word: String,
  isPositive: Boolean
)

final case class RelatedWord(
  groupId: Int,
  word: String,
  isPositive: Boolean
)

final case class RelatedWordsGroupInput(
  content: Seq[RelatedWord]
)

final case class RelatedWordsGroup(
  groupId: Int,
  content: Seq[RelatedWord]
)

trait RelatedWordsRepository {
  self: TableDefs =>

  import profile.api._

  private val relatedWordGroupsTQ = TableQuery[RelatedWordGroupsTable]
  private val relatedWordsTQ      = TableQuery[RelatedWordsTable]

  private def arrangeRows(rows: Seq[(Int, Option[(String, Boolean)])]): Seq[RelatedWordsGroup] = rows
    .groupMap(_._1)(_._2)
    .map { case (groupId, maybeRows) =>
      RelatedWordsGroup(groupId, maybeRows.flatten.map { case (word, isPositive) => RelatedWord(groupId, word, isPositive) })
    }
    .toSeq

  private val emptyRelatedWordsGroupInsertStatement = sql"insert into related_word_groups () values() returning group_id;".as[Int]

  def futureNewEmptyRelatedWordsGroup: Future[Int] = db.run(emptyRelatedWordsGroupInsertStatement.head)

  private val joinedAction = relatedWordGroupsTQ
    .joinLeft(relatedWordsTQ)
    .on { case (group, word) => group.groupId === word.groupId }
    .map { case (group, maybeWord) => (group.groupId, maybeWord.map(word => (word.word, word.isPositive))) }

  def futureAllRelatedWordGroups: Future[Seq[RelatedWordsGroup]] = for {
    rows <- db.run { joinedAction.result }
  } yield arrangeRows(rows)

  def futureRelatedWordGroupByGroupId(theGroupId: Int): Future[Option[RelatedWordsGroup]] = for {
    rows <- db.run { joinedAction.filter { case (groupId, _) => groupId === theGroupId }.result }
  } yield arrangeRows(rows).headOption

  def futureDeleteRelatedWordsGroup(groupId: Int): Future[Boolean] = for {
    rowCount <- db.run { relatedWordGroupsTQ.filter { _.groupId === groupId }.delete }
  } yield rowCount >= 1

  def futureInsertRelatedWord(groupId: Int, word: String, isPositive: Boolean): Future[Boolean] = for {
    rowCount <- db.run { relatedWordsTQ += (groupId, word, isPositive) }
  } yield rowCount == 1

  def futureUpdateRelatedWord(groupId: Int, word: String, newWord: String, newIsPositive: Boolean): Future[Boolean] = for {
    rowCount <- db.run {
      relatedWordsTQ
        .filter { relatedWord => relatedWord.groupId === groupId && relatedWord.word === word }
        .map { relatedWord => (relatedWord.word, relatedWord.isPositive) }
        .update { (newWord, newIsPositive) }
    }
  } yield rowCount == 1

  def futureDeleteRelatedWord(groupId: Int, word: String): Future[Boolean] = for {
    rowCount <- db.run { relatedWordsTQ.filter { relatedWord => relatedWord.groupId === groupId && relatedWord.word === word }.delete }
  } yield rowCount == 1

  protected class RelatedWordGroupsTable(tag: Tag) extends Table[Int](tag, "related_word_groups") {
    def groupId = column[Int]("group_id", O.PrimaryKey)

    override def * = groupId
  }

  protected class RelatedWordsTable(tag: Tag) extends Table[(Int, String, Boolean)](tag, "related_words") {
    def word       = column[String]("value", O.PrimaryKey)
    def groupId    = column[Int]("group_id")
    def isPositive = column[Boolean]("is_positive")

    @unused def groupFk = foreignKey("related_words_group_fk", groupId, relatedWordGroupsTQ)(_.groupId, onUpdate = cascade, onDelete = cascade)

    override def * = (groupId, word, isPositive)
  }

}
