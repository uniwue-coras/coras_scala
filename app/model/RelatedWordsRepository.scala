package model

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

  private val relatedWordsTQ = TableQuery[RelatedWordsTable]

  private def arrangeRows(rows: Seq[(Int, String, Boolean)]): Seq[RelatedWordsGroup] = rows
    .groupBy(_._1)
    .map { case (groupId, valuesInGroup) =>
      RelatedWordsGroup(
        groupId,
        content = valuesInGroup.map { case (_, word, isPositive) => RelatedWord(word, isPositive) }
      )
    }
    .toSeq

  def futureAllRelatedWordGroups: Future[Seq[RelatedWordsGroup]] = for {
    rows <- db.run(relatedWordsTQ.result)
  } yield arrangeRows(rows)

  def futureRelatedWordGroupByGroupId(groupId: Int): Future[Option[RelatedWordsGroup]] = for {
    rows <- db.run(relatedWordsTQ.filter { _.groupId === groupId }.result)
  } yield arrangeRows(rows).headOption

  def futureDeleteRelatedWordsGroup(groupId: Int): Future[Boolean] = for {
    rowCount <- db.run(relatedWordsTQ.filter { _.groupId === groupId }.delete)
  } yield rowCount >= 1

  protected class RelatedWordsTable(tag: Tag) extends Table[(Int, String, Boolean)](tag, "related_words") {
    private def value      = column[String]("value", O.PrimaryKey)
    def groupId            = column[Int]("group_id")
    private def isPositive = column[Boolean]("is_positive")

    override def * = (groupId, value, isPositive)
  }

}
