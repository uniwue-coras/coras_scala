package model

import scala.concurrent.Future

trait ParagraphSynonymRepository:
  self: TableDefs =>

  import profile.api._

  protected object paragraphSynonymTQ extends TableQuery[ParagraphSynonymTable](new ParagraphSynonymTable(_)):
    def byIdentifier(id: ParagraphSynonymIdentifier) = this.filter { p =>
      p.paragraphType === id.paragraphType && p.paragraphNumber === id.paragraphNumber && p.section === id.section && p.lawCode === id.lawCode
    }

  def futureInsertParagraphSynonym(paragraphSynonym: ParagraphSynonym): Future[Unit] = for {
    _ <- db.run { paragraphSynonymTQ += paragraphSynonym }
  } yield ()

  def futureUpdateParagraphSynonym(paragraphSynonymIdentifier: ParagraphSynonymIdentifier, maybeSentenceNumber: Option[Int], synonym: String): Future[Unit] =
    for {
      _ <- db.run {
        paragraphSynonymTQ
          .byIdentifier(paragraphSynonymIdentifier)
          .map { p => (p.sentenceNumber, p.synonym) }
          .update((maybeSentenceNumber, synonym))
      }
    } yield ()

  def futureDeleteParagraphSynonym(paragraphSynonymIdentifer: ParagraphSynonymIdentifier): Future[Unit] = for {
    _ <- db.run { paragraphSynonymTQ.byIdentifier(paragraphSynonymIdentifer).delete }
  } yield ()

  def futureAllParagraphSynonyms: Future[Seq[ParagraphSynonym]] = db.run { paragraphSynonymTQ.result }

  def futureResolveParagraphSynonym(identifier: ParagraphSynonymIdentifier): Future[Option[String]] = db.run {
    paragraphSynonymTQ
      .byIdentifier(identifier)
      .map { _.synonym }
      .result
      .headOption
  }

  protected class ParagraphSynonymTable(tag: Tag) extends Table[ParagraphSynonym](tag, "paragraph_synonyms"):

    def paragraphType   = column[String]("paragraph_type")
    def paragraphNumber = column[String]("paragraph_number")
    def section         = column[Int]("section")
    def sentenceNumber  = column[Option[Int]]("sentence_number")
    def lawCode         = column[String]("law_code")
    def synonym         = column[String]("synonym")

    override def * = (paragraphType, paragraphNumber, section, sentenceNumber, lawCode, synonym).mapTo[ParagraphSynonym]
