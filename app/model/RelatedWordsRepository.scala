package model

import scala.annotation.unused
import scala.concurrent.Future

final case class RelatedWord(
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

  private def arrangeRows(rows: Seq[(Int, String, Boolean)]): Seq[RelatedWordsGroup] = rows
    .groupBy(_._1)
    .map { case (groupId, valuesInGroup) =>
      RelatedWordsGroup(
        groupId,
        content = valuesInGroup.map { case (_, word, isPositive) => RelatedWord(word, isPositive) }
      )
    }
    .toSeq

  private val emptyRelatedWordsGroupInsertStatement = sql"insert into related_word_groups () values() returning group_id;".as[Int]

  def futureNewEmptyRelatedWordsGroup: Future[Int] = db.run(emptyRelatedWordsGroupInsertStatement.head)

  def futureAllRelatedWordGroups: Future[Seq[RelatedWordsGroup]] = {
    val newAction = relatedWordGroupsTQ
      .joinLeft(relatedWordsTQ)
      .on { case (group, word) => group.groupId === word.groupId }
      .map { case (group, maybeWord) => (group.groupId, maybeWord.map(word => (word.word, word.isPositive))) }
      .result

    val y = for {
      rows: Seq[(Int, Option[(String, Boolean)])] <- db.run(newAction)

      groupedRows = rows
        .groupMap(_._1)(_._2)
        .map { case (groupId, maybeRows) => (groupId, maybeRows.flatten) }
    } yield rows

    println(y)

    for {
      // TODO: empty groups!
      rows <- db.run(
        relatedWordsTQ.result
      )
    } yield arrangeRows(rows)
  }

  def futureRelatedWordGroupByGroupId(groupId: Int): Future[Option[RelatedWordsGroup]] = for {
    rows <- db.run(relatedWordsTQ.filter { _.groupId === groupId }.result)
  } yield arrangeRows(rows).headOption

  def futureDeleteRelatedWordsGroup(groupId: Int): Future[Boolean] = for {
    rowCount <- db.run(relatedWordsTQ.filter { _.groupId === groupId }.delete)
  } yield rowCount >= 1

  protected class RelatedWordGroupsTable(tag: Tag) extends Table[Int](tag, "related_word_groups") {
    def groupId = column[Int]("group_id", O.PrimaryKey)

    override def * = groupId
  }

  protected class RelatedWordsTable(tag: Tag) extends Table[(Int, String, Boolean)](tag, "related_words") {
    def word       = column[String]("value", O.PrimaryKey)
    def groupId    = column[Int]("group_id")
    def isPositive = column[Boolean]("is_positive")

    @unused
    def groupFk = foreignKey("related_words_group_fk", groupId, relatedWordGroupsTQ)(_.groupId, onUpdate = cascade, onDelete = cascade)

    override def * = (groupId, word, isPositive)
  }

}
