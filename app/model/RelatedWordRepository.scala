package model

import scala.concurrent.Future

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
