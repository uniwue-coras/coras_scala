package model

import scala.concurrent.Future

trait AbbreviationsRepository {
  self: TableDefs =>

  import profile.api._

  private val abbreviationsTQ = TableQuery[AbbreviationsTable]

  def futureResolveAbbreviation(abbreviation: String): Future[Option[String]] = db.run(
    abbreviationsTQ
      .filter { _.abbreviation === abbreviation }
      .map { _.realText }
      .result
      .headOption
  )

  def futureAllAbbreviations(): Future[Map[String, String]] = for {
    abbreviations <- db.run(abbreviationsTQ.result)
  } yield abbreviations.toMap

  protected class AbbreviationsTable(tag: Tag) extends Table[(String, String)](tag, "abbreviations") {
    def abbreviation = column[String]("abbreviation", O.PrimaryKey)
    def realText     = column[String]("real_text")

    override def * = (abbreviation, realText)
  }

}
