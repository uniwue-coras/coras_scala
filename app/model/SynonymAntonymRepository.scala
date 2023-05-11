package model

import scala.concurrent.Future

final case class SynonymAntonym(
  word: String,
  isPositive: Boolean
)

final case class SynonymAntonymBag(
  groupId: Int,
  content: Seq[SynonymAntonym]
)

trait SynonymAntonymRepository {
  self: TableDefs =>

  import profile.api._

  private val synonymsTQ = TableQuery[SynonymsTable]

  def futureAllSynonymAntonymBags(): Future[Seq[SynonymAntonymBag]] = for {
    rows <- db.run(synonymsTQ.result)

    result = rows
      .groupBy(_._1)
      .map { case (groupId, valuesInGroup) =>
        val content = valuesInGroup.map { case (_, word, isPositive) => SynonymAntonym(word, isPositive) }
        SynonymAntonymBag(groupId, content)
      }
      .toSeq
  } yield result

  protected class SynonymsTable(tag: Tag) extends Table[(Int, String, Boolean)](tag, "synonyms_and_antonyms") {
    private def groupId    = column[Int]("group_id")
    private def value      = column[String]("value")
    private def isPositive = column[Boolean]("is_positive")

    @scala.annotation.unused
    def pk = primaryKey("synonyms_pk", (groupId, value))

    override def * = (groupId, value, isPositive)
  }

}
