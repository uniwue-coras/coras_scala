package model

import scala.concurrent.Future

trait RelatedWordRepository {
  self: TableDefs =>

  import profile.api._

  private val relatedWordsTQ = TableQuery[RelatedWordsTable]

  def futureAllRelatedWordGroups: Future[Seq[RelatedWordsGroup]] = for {
    rows <- db.run {
      relatedWordGroupsTQ
        .joinLeft(relatedWordsTQ)
        .on { case (group, word) => group.groupId === word.groupId }
        .result
    }

    groupedValues = rows
      .groupMap { _._1 } { _._2 }
      .view
      .map { case (groupId, relatedWordOptions) => RelatedWordsGroup(groupId, relatedWordOptions.flatten) }
      .toSeq
  } yield groupedValues

  def futureRelatedWordGroupByGroupId(groupId: Int): Future[Option[RelatedWordsGroup]] = for {
    relatedWordsInGroup <- db.run { relatedWordsTQ.filter { _.groupId === groupId }.result }

    maybeGroup = if (relatedWordsInGroup.isEmpty) None else Some(RelatedWordsGroup(groupId, relatedWordsInGroup))
  } yield maybeGroup

  def futureInsertRelatedWord(relatedWord: DbRelatedWord): Future[Unit] = for {
    _ <- db.run { relatedWordsTQ += relatedWord }
  } yield ()

  def futureUpdateRelatedWord(groupId: Int, word: String, newWord: String, newIsPositive: Boolean): Future[Unit] = for {
    _ <- db.run {
      relatedWordsTQ
        .filter { relatedWord => relatedWord.groupId === groupId && relatedWord.word === word }
        .map { relatedWord => (relatedWord.word, relatedWord.isPositive) }
        .update { (newWord, newIsPositive) }
    }
  } yield ()

  def futureDeleteRelatedWord(relatedWord: DbRelatedWord): Future[Unit] = for {
    _ <- db.run { relatedWordsTQ.filter { row => row.groupId === relatedWord.groupId && row.word === relatedWord.word }.delete }
  } yield ()

  protected class RelatedWordsTable(tag: Tag) extends Table[DbRelatedWord](tag, "related_words") {
    def groupId    = column[Int]("group_id")
    def word       = column[String]("value", O.PrimaryKey)
    def isPositive = column[Boolean]("is_positive")

    def groupFk = foreignKey("related_words_group_fk", groupId, relatedWordGroupsTQ)(_.groupId, onUpdate = cascade, onDelete = cascade)

    override def * = (groupId, word, isPositive).mapTo[DbRelatedWord]
  }
}
