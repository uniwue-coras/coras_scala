package model

import scala.concurrent.Future

final case class ParagraphCitationAnnotationKey(
  exerciseId: Int,
  username: String,
  sampleNodeId: Int,
  userNodeId: Int,
  awaitedParagraph: String
)

trait ParagraphCitationAnnotationRepository {
  self: TableDefs =>

  import profile.api._

  protected object paragraphCitationAnnotationsTQ extends TableQuery[ParagraphCitationAnnotationTable](new ParagraphCitationAnnotationTable(_)) {
    def byKey(key: ParagraphCitationAnnotationKey) = this.filter { parCit =>
      parCit.exerciseId === key.exerciseId && parCit.username === key.username && parCit.sampleNodeId === key.sampleNodeId && parCit.userNodeId === key.userNodeId && parCit.awaitedParagraph === key.awaitedParagraph
    }
  }

  def futureSelectParagraphCitationAnnotationsForUserNode(exerciseId: Int, username: String, userNodeId: Int): Future[Seq[DbParagraphCitationAnnotation]] =
    db.run {
      paragraphCitationAnnotationsTQ.filter { pca =>
        pca.exerciseId === exerciseId && pca.username === username && pca.userNodeId === userNodeId && !pca.deleted
      }.result
    }

  def futureSelectParagraphCitationAnnotationsForMatch(
    exerciseId: Int,
    username: String,
    sampleNodeId: Int,
    userNodeId: Int
  ): Future[Seq[DbParagraphCitationAnnotation]] = db.run {
    paragraphCitationAnnotationsTQ.filter { pca =>
      pca.exerciseId === exerciseId && pca.username === username && pca.userNodeId === userNodeId && pca.sampleNodeId === sampleNodeId && !pca.deleted
    }.result
  }

  def futureSelectParagraphCitationAnnotation(key: ParagraphCitationAnnotationKey): Future[Option[DbParagraphCitationAnnotation]] =
    db.run { paragraphCitationAnnotationsTQ.byKey { key }.result.headOption }

  def futureInsertParagraphCitationAnnotation(parCitAnno: DbParagraphCitationAnnotation): Future[Unit] = for {
    _ <- db.run { paragraphCitationAnnotationsTQ += parCitAnno }
  } yield ()

  def futureUpsertParagraphCitationAnnotations(annos: Seq[DbParagraphCitationAnnotation]): Future[Unit] = for {
    _ <- db.run { paragraphCitationAnnotationsTQ ++= annos }
  } yield ()

  def futureUpdateParagraphCitationAnnotation(key: ParagraphCitationAnnotationKey, newValues: ParagraphCitationAnnotationInput): Future[Unit] = for {
    _ <- db.run { paragraphCitationAnnotationsTQ.byKey { key }.map { _.editableValues } update newValues }
  } yield ()

  def futureDeletePararaphCitationAnnotation(key: ParagraphCitationAnnotationKey): Future[Unit] = for {
    _ <- db.run { paragraphCitationAnnotationsTQ.byKey { key }.map { _.deleted }.update { true } }
  } yield ()

  protected class ParagraphCitationAnnotationTable(tag: Tag) extends Table[DbParagraphCitationAnnotation](tag, "paragraph_citation_annotations") {
    def exerciseId       = column[Int]("exercise_id")
    def username         = column[String]("username")
    def sampleNodeId     = column[Int]("sample_node_id")
    def userNodeId       = column[Int]("user_node_id")
    def awaitedParagraph = column[String]("awaited_paragraph")
    def correctness      = column[Correctness]("correctness")
    def citedParagraph   = column[Option[String]]("cited_paragraph")
    def explanation      = column[Option[String]]("explanation")
    def deleted          = column[Boolean]("deleted")

    def pk = primaryKey("paragraph_citation_annotations_pk", (username, exerciseId, sampleNodeId, userNodeId, awaitedParagraph))

    def solutionMatchFk = foreignKey("par_cit_anno_sol_match_fk", (username, exerciseId, sampleNodeId, userNodeId), matchesTQ)(
      m => (m.username, m.exerciseId, m.sampleNodeId, m.userNodeId),
      onUpdate = ForeignKeyAction.Cascade,
      onDelete = ForeignKeyAction.Cascade
    )

    def editableValues = (awaitedParagraph, correctness, citedParagraph, explanation).mapTo[ParagraphCitationAnnotationInput]

    override def * = (
      exerciseId,
      username,
      sampleNodeId,
      userNodeId,
      awaitedParagraph,
      correctness,
      citedParagraph,
      explanation,
      deleted
    ).mapTo[DbParagraphCitationAnnotation]
  }
}
