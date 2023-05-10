package model

import scala.concurrent.Future

trait SynonymsRepository {
  self: TableDefs =>

  import profile.api._

  private val synonymsTQ = TableQuery[SynonymsTable]

  def futureGetSynonyms(value: String): Future[Seq[String]] = db.run(
    synonymsTQ
      .filter { _.value === value }
      .join(synonymsTQ)
      .on { case (first, second) => first.groupId === second.groupId }
      .filter { case (first, second) => first.value =!= second.value }
      .map { case (_, second) => second.value }
      .result
  )

  protected class SynonymsTable(tag: Tag) extends Table[(Int, String)](tag, "synonyms") {
    def groupId = column[Int]("group_id")
    def value   = column[String]("value")

    @scala.annotation.unused
    def pk = primaryKey("synonyms_pk", (groupId, value))

    override def * = (groupId, value)
  }

}
