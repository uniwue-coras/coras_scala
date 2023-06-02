package model

import scala.concurrent.Future

final case class Abbreviation(
  abbreviation: String,
  word: String
)

trait AbbreviationsRepository {
  self: TableDefs =>

  import profile.api._

  private val abbreviationsTQ = TableQuery[AbbreviationsTable]

  def futureAbbreviation(abbreviation: String): Future[Option[Abbreviation]] = for {
    maybeRow <- db.run { abbreviationsTQ.filter { _.abbreviation === abbreviation }.result.headOption }
  } yield maybeRow.map { case (abbreviation, word) => Abbreviation(abbreviation, word) }

  def futureAllAbbreviationsAsMap: Future[Map[String, String]] = for {
    abbreviations <- db.run(abbreviationsTQ.result)
  } yield abbreviations.toMap

  def futureAllAbbreviations: Future[Seq[Abbreviation]] = for {
    rows <- db.run(abbreviationsTQ.result)
    result = rows.map { case (abbreviation, word) => Abbreviation(abbreviation, word) }
  } yield result

  def futureInsertAbbreviation(abbreviation: String, word: String): Future[Boolean] = for {
    rowCount <- db.run { abbreviationsTQ += (abbreviation, word) }
  } yield rowCount == 1

  def futureUpdateAbbreviation(abbreviation: String, newAbbreviation: String, newWord: String): Future[Boolean] = for {
    rowCount <- db.run {
      abbreviationsTQ
        .filter { _.abbreviation === abbreviation }
        .update { (newAbbreviation, newWord) }
    }
  } yield rowCount == 1

  def futureDeleteAbbreviation(abbreviation: String): Future[Boolean] = for {
    rowCount <- db.run { abbreviationsTQ.filter { _.abbreviation === abbreviation }.delete }
  } yield rowCount == 1

  protected class AbbreviationsTable(tag: Tag) extends Table[(String, String)](tag, "abbreviations") {
    def abbreviation     = column[String]("abbreviation", O.PrimaryKey)
    private def realText = column[String]("real_text")

    override def * = (abbreviation, realText)
  }

}
